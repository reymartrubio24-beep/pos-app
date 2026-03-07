<?php
session_start();
require_once '../../config/db.php';

if (!isset($_SESSION['user_id']) || $_SESSION['role'] !== 'owner') {
    http_response_code(403);
    exit;
}

header('Content-Type: text/csv');
header('Content-Disposition: attachment; filename="sales_report_' . date('Ymd_His') . '.csv"');

$output = fopen('php://output', 'w');

// Header
fputcsv($output, ['Invoice No.', 'Date & Time', 'Staff Name', 'Subtotal (P)', 'Tax (P)', 'Grand Total (P)']);

// Data
// Optional: filter by date range if provided
$start_date = $_GET['start_date'] ?? null;
$end_date = $_GET['end_date'] ?? null;

if ($start_date && $end_date) {
    $stmt = $pdo->prepare("SELECT t.id, t.created_at, u.full_name, t.subtotal, t.vat, t.total FROM transactions t JOIN users u ON t.user_id = u.id WHERE DATE(t.created_at) BETWEEN ? AND ? ORDER BY t.created_at DESC");
    $stmt->execute([$start_date, $end_date]);
} else {
    $stmt = $pdo->prepare("SELECT t.id, t.created_at, u.full_name, t.subtotal, t.vat, t.total FROM transactions t JOIN users u ON t.user_id = u.id ORDER BY t.created_at DESC");
    $stmt->execute();
}

while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
    // Format ID like #TRX-0001
    $row['id'] = '#TRX-' . str_pad($row['id'], 4, '0', STR_PAD_LEFT);
    fputcsv($output, $row);
}

fclose($output);
exit;
