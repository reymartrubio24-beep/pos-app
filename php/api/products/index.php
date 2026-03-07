<?php
require_once '../../config/db.php';
require_once '../utils/common.php';

checkAuth();


$category = $_GET['category'] ?? '';
$search = $_GET['search'] ?? '';

try {
    $query = "SELECT * FROM products WHERE 1=1";
    $params = [];

    if ($category && $category !== 'All') {
        $query .= " AND category = ?";
        $params[] = $category;
    }

    if ($search) {
        $query .= " AND name LIKE ?";
        $params[] = "%$search%";
    }

    $stmt = $pdo->prepare($query);
    $stmt->execute($params);
    $products = $stmt->fetchAll();

    sendResponse($products);
} catch (Exception $e) {
    sendResponse(['error' => 'Database error: ' . $e->getMessage()], 500);
}