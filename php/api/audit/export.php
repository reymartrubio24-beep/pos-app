<?php
session_start();
require_once '../../config/db.php';

if (!isset($_SESSION['user_id']) || $_SESSION['role'] !== 'owner') {
    http_response_code(403);
    exit;
}

header('Content-Type: text/csv');
header('Content-Disposition: attachment; filename="audit_logs_' . date('Ymd_His') . '.csv"');

$output = fopen('php://output', 'w');

// Header
fputcsv($output, ['ID', 'Timestamp', 'User', 'Role', 'Action', 'Details']);

// Data
$stmt = $pdo->prepare("SELECT a.id, a.created_at, u.full_name, u.role, a.action, a.details FROM audit_logs a JOIN users u ON a.user_id = u.id ORDER BY a.created_at DESC");
$stmt->execute();

while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
    fputcsv($output, $row);
}

fclose($output);
exit;
