<?php
require_once '../../config/db.php';
require_once '../utils/common.php';

checkAuth(['owner', 'admin']);

header('Content-Type: text/csv');
header('Content-Disposition: attachment; filename="sales_report_' . date('Ymd_His') . '.csv"');

$output = fopen('php://output', 'w');

// Header
fputcsv($output, ['Invoice No.', 'Date & Time', 'Staff Name', 'Products Sold', 'Subtotal (P)', 'Tax (P)', 'Grand Total (P)']);

// Data
// Optional: filter by date range if provided
$start_date = $_GET['start_date'] ?? null;
$end_date = $_GET['end_date'] ?? null;

if ($start_date && $end_date) {
    $stmt = $pdo->prepare("
        SELECT t.id, t.created_at, u.full_name, 
        GROUP_CONCAT(CONCAT(ti.product_name, ' (', ti.quantity, ')') ORDER BY ti.product_name SEPARATOR ', ') as product_names,
        t.subtotal, t.vat, t.total 
        FROM transactions t 
        JOIN users u ON t.user_id = u.id 
        LEFT JOIN transaction_items ti ON t.id = ti.transaction_id
        WHERE DATE(t.created_at) BETWEEN ? AND ? 
        GROUP BY t.id
        ORDER BY t.created_at DESC
    ");
    $stmt->execute([$start_date, $end_date]);
} else {
    $stmt = $pdo->prepare("
        SELECT t.id, t.created_at, u.full_name, 
        GROUP_CONCAT(CONCAT(ti.product_name, ' (', ti.quantity, ')') ORDER BY ti.product_name SEPARATOR ', ') as product_names,
        t.subtotal, t.vat, t.total 
        FROM transactions t 
        JOIN users u ON t.user_id = u.id 
        LEFT JOIN transaction_items ti ON t.id = ti.transaction_id
        GROUP BY t.id
        ORDER BY t.created_at DESC
    ");
    $stmt->execute();
}

while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
    // Format ID like #TRX-0001
    $row['id'] = '#TRX-' . str_pad($row['id'], 4, '0', STR_PAD_LEFT);
    fputcsv($output, $row);
}

fclose($output);
exit;
