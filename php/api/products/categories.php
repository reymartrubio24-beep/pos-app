<?php
require_once '../../config/db.php';
require_once '../utils/common.php';

checkAuth();

try {
    $stmt = $pdo->prepare("SELECT DISTINCT category FROM products ORDER BY category ASC");
    $stmt->execute();
    $categories = $stmt->fetchAll(PDO::FETCH_COLUMN);

    sendResponse($categories);
} catch (Exception $e) {
    sendResponse(['error' => 'Database error: ' . $e->getMessage()], 500);
}
