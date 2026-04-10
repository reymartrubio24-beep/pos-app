<?php
require_once '../../config/db.php';
require_once '../utils/common.php';

checkAuth(['owner', 'admin']);

$start_date = $_GET['start_date'] ?? date('Y-m-d', strtotime('-30 days'));
$end_date = $_GET['end_date'] ?? date('Y-m-d');

try {
    $stmt = $pdo->prepare("
        SELECT t.*, u.full_name as cashier_name,
        GROUP_CONCAT(CONCAT(ti.product_name, ' (', ti.quantity, ')') ORDER BY ti.product_name SEPARATOR ', ') as product_names
        FROM transactions t 
        LEFT JOIN users u ON t.user_id = u.id 
        LEFT JOIN transaction_items ti ON t.id = ti.transaction_id
        WHERE DATE(t.created_at) BETWEEN ? AND ? 
        GROUP BY t.id
        ORDER BY t.created_at DESC
    ");
    $stmt->execute([$start_date, $end_date]);
    $transactions = $stmt->fetchAll();
    sendResponse($transactions);
} catch (Exception $e) {
    sendResponse(['error' => 'Database error: ' . $e->getMessage()], 500);
}
