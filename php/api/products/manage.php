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
        $name = $data['name'] ?? '';
        $category = $data['category'] ?? '';
        $price = $data['price'] ?? 0;
        $stock = $data['stock'] ?? 0;
        $threshold = $data['low_stock_threshold'] ?? 10;

        if (empty($name)) {
            throw new Exception('Product name is required');
        }

        $image_url = handleFileUpload() ?: ($data['image_url'] ?? '');

        $stmt = $pdo->prepare("INSERT INTO products (name, category, price, stock, low_stock_threshold, image_url) VALUES (?, ?, ?, ?, ?, ?)");
        $stmt->execute([$name, $category, $price, $stock, $threshold, $image_url]);

        $auditStmt = $pdo->prepare("INSERT INTO audit_logs (user_id, action, details) VALUES (?, ?, ?)");
        $auditStmt->execute([$_SESSION['user_id'], 'Inventory', "Added new product: $name"]);

        sendResponse(['success' => true]);
    }

    if ($action === 'update') {
        $id = $data['id'] ?? null;
        $name = $data['name'] ?? '';
        $category = $data['category'] ?? '';
        $price = $data['price'] ?? 0;
        $stock = $data['stock'] ?? 0;
        $threshold = $data['low_stock_threshold'] ?? 10;

        if (!$id) {
            throw new Exception('Product ID is missing');
        }
        if (empty($name)) {
            throw new Exception('Product name is required');
        }

        $image_url = handleFileUpload();

        if ($image_url) {
            $stmt = $pdo->prepare("UPDATE products SET name = ?, category = ?, price = ?, stock = ?, low_stock_threshold = ?, image_url = ? WHERE id = ?");
            $stmt->execute([$name, $category, $price, $stock, $threshold, $image_url, $id]);
        } else {
            $stmt = $pdo->prepare("UPDATE products SET name = ?, category = ?, price = ?, stock = ?, low_stock_threshold = ? WHERE id = ?");
            $stmt->execute([$name, $category, $price, $stock, $threshold, $id]);
        }

        $auditStmt = $pdo->prepare("INSERT INTO audit_logs (user_id, action, details) VALUES (?, ?, ?)");
        $auditStmt->execute([$_SESSION['user_id'], 'Inventory', "Updated product: $name"]);

        sendResponse(['success' => true]);
    }

    if ($action === 'delete') {
        if ($_SESSION['role'] !== 'owner') {
            throw new Exception('Unauthorized: Only an owner can delete products.');
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

