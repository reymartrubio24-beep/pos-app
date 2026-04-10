<?php
require_once '../../config/db.php';
require_once '../utils/common.php';

checkAuth();

$data = getJsonInput();

$items = $data['items'] ?? [];
$total = $data['total'] ?? 0;
$subtotal = $data['subtotal'] ?? 0;
$vat = $data['vat'] ?? 0;
$user_id = $_SESSION['user_id'] ?? null;
$payment_method = $data['payment_method'] ?? 'Cash';
$amount_received = $data['amount_received'] ?? $total;

if (empty($items)) {
    sendResponse(['error' => 'Empty transaction.'], 400);
}

try {
    $pdo->beginTransaction();

    // Insert transaction record
    $stmt = $pdo->prepare("INSERT INTO transactions (user_id, total, vat, subtotal, payment_method, amount_received) VALUES (?, ?, ?, ?, ?, ?)");
    $stmt->execute([$user_id, $total, $vat, $subtotal, $payment_method, $amount_received]);
    $transactionId = $pdo->lastInsertId();

    // We compile product names with quantities to store in the main transaction record
    $productCounts = [];
    foreach ($items as $item) {
        $productId = $item['id'];
        $quantity = $item['quantity'];
        $price = $item['price'];

        // Fetch product name
        $prodStmt = $pdo->prepare("SELECT name FROM products WHERE id = ?");
        $prodStmt->execute([$productId]);
        $prodRow = $prodStmt->fetch();
        $productName = $prodRow ? $prodRow['name'] : 'Unknown Product';
        
        if (isset($productCounts[$productName])) {
            $productCounts[$productName] += $quantity;
        } else {
            $productCounts[$productName] = $quantity;
        }

        // Update Stock
        $updateStockStmt = $pdo->prepare("UPDATE products SET stock = stock - ? WHERE id = ?");
        $updateStockStmt->execute([$quantity, $productId]);

        // Insert Item
        $itemStmt = $pdo->prepare("INSERT INTO transaction_items (transaction_id, product_id, product_name, quantity, price_at_time) VALUES (?, ?, ?, ?, ?)");
        $itemStmt->execute([$transactionId, $productId, $productName, $quantity, $price]);
    }

    // Format string as "Product A (2), Product B (1)"
    $formattedNames = [];
    foreach ($productCounts as $name => $count) {
        $formattedNames[] = "$name ($count)";
    }
    $productNamesStr = implode(', ', $formattedNames);
    
    $updateTxStmt = $pdo->prepare("UPDATE transactions SET product_names = ? WHERE id = ?");
    $updateTxStmt->execute([$productNamesStr, $transactionId]);

    // Audit Log
    $name = $_SESSION['full_name'];
    $auditStmt = $pdo->prepare("INSERT INTO audit_logs (user_id, action, details) VALUES (?, ?, ?)");
    $auditStmt->execute([$user_id, 'Transaction', "Processed transaction: $productNamesStr. Total: P$total"]);

    $pdo->commit();
    sendResponse(['success' => true, 'id' => $transactionId]);
} catch (Exception $e) {
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }
    sendResponse(['error' => 'Transaction failed: ' . $e->getMessage()], 500);
}
