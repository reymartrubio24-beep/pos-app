<?php
require_once '../../config/db.php';
require_once '../utils/common.php';

checkAuth(['owner', 'admin']);

$start_date = $_GET['start_date'] ?? date('Y-m-d', strtotime('-30 days'));
$end_date = $_GET['end_date'] ?? date('Y-m-d');

try {
    $stmt = $pdo->prepare("
        SELECT t.*, u.full_name as cashier_name,
        (SELECT IFNULL(SUM(ti_qty.quantity), 0) FROM transaction_items ti_qty WHERE ti_qty.transaction_id = t.id) as item_count
        FROM transactions t 
        LEFT JOIN users u ON t.user_id = u.id 
        WHERE DATE(t.created_at) BETWEEN ? AND ? 
        ORDER BY t.created_at DESC
    ");
    $stmt->execute([$start_date, $end_date]);
    $transactions = $stmt->fetchAll();
    sendResponse($transactions);
} catch (Exception $e) {
    sendResponse(['error' => 'Database error: ' . $e->getMessage()], 500);
}
