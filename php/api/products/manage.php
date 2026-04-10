<?php
require_once '../../config/db.php';
require_once '../utils/common.php';

checkAuth();

$action = $_GET['action'] ?? '';
$data = getJsonInput();
if (empty($data)) {
    $data = $_POST;
}

function handleFileUpload()
{
    if (!isset($_FILES['image']) || $_FILES['image']['error'] !== UPLOAD_ERR_OK) {
        return null;
    }

    $uploadDir = __DIR__ . '/../../uploads/products/';
    if (!is_dir($uploadDir)) {
        if (!mkdir($uploadDir, 0777, true)) {
            return null;
        }
    }

    $fileInfo = pathinfo($_FILES['image']['name']);
    $extension = strtolower($fileInfo['extension']);
    $allowed = ['jpg', 'jpeg', 'png', 'webp', 'gif'];

    if (!in_array($extension, $allowed)) {
        return null;
    }

    $filename = uniqid() . '.' . $extension;
    $targetPath = $uploadDir . $filename;

    if (move_uploaded_file($_FILES['image']['tmp_name'], $targetPath)) {
        return '/php/uploads/products/' . $filename;
    }
    return null;
}

try {
    if ($action === 'create') {
        if ($_SESSION['role'] !== 'owner' && $_SESSION['role'] !== 'admin') {
            throw new Exception('Unauthorized: Only an owner or admin can create products.');
        }
        $name = $data['name'] ?? '';
        $category = $data['category'] ?? '';
        $price = $data['price'] ?? 0;
        $stock = $data['stock'] ?? 0;
        $threshold = $data['low_stock_threshold'] ?? 10;

        if (empty($name)) {
            throw new Exception('Product name is required');
        }

        // Check for duplicate product name (case-insensitive)
        $dupCheck = $pdo->prepare("SELECT id FROM products WHERE LOWER(name) = LOWER(?)");
        $dupCheck->execute([$name]);
        if ($dupCheck->fetch()) {
            sendResponse(['success' => false, 'error' => "A product named \"$name\" already exists in the database. Please use a different name."], 400);
            return;
        }

        $image_url = handleFileUpload() ?: ($data['image_url'] ?? '');

        $stmt = $pdo->prepare("INSERT INTO products (name, category, price, stock, low_stock_threshold, image_url) VALUES (?, ?, ?, ?, ?, ?)");
        $stmt->execute([$name, $category, $price, $stock, $threshold, $image_url]);

        $auditStmt = $pdo->prepare("INSERT INTO audit_logs (user_id, action, details) VALUES (?, ?, ?)");
        $auditStmt->execute([$_SESSION['user_id'], 'Inventory', "Added new product: $name"]);

        sendResponse(['success' => true]);
    }

    if ($action === 'update') {
        if ($_SESSION['role'] !== 'owner' && $_SESSION['role'] !== 'admin') {
            throw new Exception('Unauthorized: Only an owner or admin can update products.');
        }
        $id = $data['id'] ?? null;
        $name = $data['name'] ?? '';
        $category = $data['category'] ?? '';
        $price = $data['price'] ?? 0;
        $stock = $data['stock'] ?? 0;
        $threshold = $data['low_stock_threshold'] ?? 10;

        if (!$id) {
            throw new Exception('Product ID is missing');
        }

        // Fetch current values to check for stock changes
        $oldStmt = $pdo->prepare("SELECT stock, name FROM products WHERE id = ?");
        $oldStmt->execute([$id]);
        $oldProduct = $oldStmt->fetch();
        
        if (!$oldProduct) {
            throw new Exception('Product not found');
        }

        // Check for duplicate product name
        $dupCheck = $pdo->prepare("SELECT id FROM products WHERE LOWER(name) = LOWER(?) AND id != ?");
        $dupCheck->execute([$name, $id]);
        if ($dupCheck->fetch()) {
            sendResponse(['success' => false, 'error' => "A product named \"$name\" already exists."], 400);
            return;
        }

        $image_url = handleFileUpload();
        $isRestock = (int)$stock > (int)$oldProduct['stock'];
        $diff = (int)$stock - (int)$oldProduct['stock'];

        if ($image_url) {
            $stmt = $pdo->prepare("UPDATE products SET name = ?, category = ?, price = ?, stock = ?, low_stock_threshold = ?, image_url = ?" . ($isRestock ? ", last_restock = CURRENT_TIMESTAMP, last_stock_before = ?, last_stock_added = ?" : "") . " WHERE id = ?");
            if ($isRestock) {
                $stmt->execute([$name, $category, $price, $stock, $threshold, $image_url, $oldProduct['stock'], $diff, $id]);
            } else {
                $stmt->execute([$name, $category, $price, $stock, $threshold, $image_url, $id]);
            }
        } else {
            $stmt = $pdo->prepare("UPDATE products SET name = ?, category = ?, price = ?, stock = ?, low_stock_threshold = ?" . ($isRestock ? ", last_restock = CURRENT_TIMESTAMP, last_stock_before = ?, last_stock_added = ?" : "") . " WHERE id = ?");
            if ($isRestock) {
                $stmt->execute([$name, $category, $price, $stock, $threshold, $oldProduct['stock'], $diff, $id]);
            } else {
                $stmt->execute([$name, $category, $price, $stock, $threshold, $id]);
            }
        }

        // Detailed Audit Log for accountability
        $auditDetails = "Updated product: $name";
        if ($isRestock) {
            $auditDetails = "Restocked $name: +$diff units (Old: {$oldProduct['stock']}, New: $stock)";
        } elseif ((int)$stock < (int)$oldProduct['stock']) {
            $auditDetails = "Reduced stock for $name: $diff units (Old: {$oldProduct['stock']}, New: $stock)";
        }

        $auditStmt = $pdo->prepare("INSERT INTO audit_logs (user_id, action, details) VALUES (?, ?, ?)");
        $auditStmt->execute([$_SESSION['user_id'], 'Inventory', $auditDetails]);

        sendResponse(['success' => true]);
    }

    if ($action === 'delete') {
        if ($_SESSION['role'] !== 'owner' && $_SESSION['role'] !== 'admin') {
            throw new Exception('Unauthorized: Only an owner or admin can delete products.');
        }
        $id = $_GET['id'] ?? null;
        if (!$id) {
            throw new Exception('Product ID is required for deletion');
        }

        $auditInfo = $pdo->prepare("SELECT name FROM products WHERE id = ?");
        $auditInfo->execute([$id]);
        $prod = $auditInfo->fetch();

        if (!$prod) {
            throw new Exception('Product not found');
        }

        $stmt = $pdo->prepare("DELETE FROM products WHERE id = ?");
        $stmt->execute([$id]);

        $auditStmt = $pdo->prepare("INSERT INTO audit_logs (user_id, action, details) VALUES (?, ?, ?)");
        $auditStmt->execute([$_SESSION['user_id'], 'Inventory', "Deleted product: " . $prod['name']]);

        sendResponse(['success' => true]);
    }

    sendResponse(['error' => 'Invalid action'], 400);

} catch (Exception $e) {
    if ($e->getCode() == '23000') {
        sendResponse(['success' => false, 'error' => 'Cannot delete product because it has associated transaction records.'], 400);
    }
    sendResponse(['success' => false, 'error' => $e->getMessage()], 500);
}

