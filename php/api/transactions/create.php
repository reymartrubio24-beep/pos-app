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

if (empty($items)) {
    sendResponse(['error' => 'Empty transaction.'], 400);
}

try {
    $pdo->beginTransaction();

    // Insert transaction
    $stmt = $pdo->prepare("INSERT INTO transactions (user_id, total, vat, subtotal) VALUES (?, ?, ?, ?)");
    $stmt->execute([$user_id, $total, $vat, $subtotal]);
    $transactionId = $pdo->lastInsertId();

    foreach ($items as $item) {
        $productId = $item['id'];
        $quantity = $item['quantity'];
        $price = $item['price'];

        // Update Stock
        $updateStockStmt = $pdo->prepare("UPDATE products SET stock = stock - ? WHERE id = ?");
        $updateStockStmt->execute([$quantity, $productId]);

        // Insert Item
        $itemStmt = $pdo->prepare("INSERT INTO transaction_items (transaction_id, product_id, quantity, price_at_time) VALUES (?, ?, ?, ?)");
        $itemStmt->execute([$transactionId, $productId, $quantity, $price]);
    }

    // Audit Log
    $name = $_SESSION['full_name'];
    $auditStmt = $pdo->prepare("INSERT INTO audit_logs (user_id, action, details) VALUES (?, ?, ?)");
    $auditStmt->execute([$user_id, 'Transaction', "Processed transaction #$transactionId, Total: P$total"]);

    $pdo->commit();
    sendResponse(['success' => true, 'id' => $transactionId]);
} catch (Exception $e) {
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }
    sendResponse(['error' => 'Transaction failed: ' . $e->getMessage()], 500);
}
