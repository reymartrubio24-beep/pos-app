<?php
require_once '../../config/db.php';
require_once '../utils/common.php';

checkAuth(['owner', 'admin', 'cashier']);

$product_name = $_GET['name'] ?? null;
$filename_prefix = $product_name ? 'history_' . str_replace(' ', '_', $product_name) : 'global_stock_history';

header('Content-Type: text/csv');
header('Content-Disposition: attachment; filename="' . $filename_prefix . '_' . date('Ymd_His') . '.csv"');

$output = fopen('php://output', 'w');

// Header
fputcsv($output, ['Date & Time', 'Staff Name', 'Product Name', 'Quantity Added', 'Role', 'Full Details']);

// Query
$sql = "
    SELECT a.*, u.full_name as user_name, u.role as user_role 
    FROM audit_logs a 
    JOIN users u ON a.user_id = u.id 
    WHERE a.action = 'Inventory' 
    AND a.details LIKE '%Restocked%'
";

$params = [];
if ($product_name) {
    $sql .= " AND a.details LIKE ?";
    $params[] = '%' . $product_name . '%';
}

$sql .= " ORDER BY a.created_at DESC";

try {
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);

    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $details = $row['details'];
        preg_match('/Restocked (.*?): \+([\d.]+)/', $details, $matches);
        
        $pName = $matches[1] ?? 'Unknown Item';
        $qty = $matches[2] ?? '0';

        fputcsv($output, [
            $row['created_at'],
            $row['user_name'],
            $pName,
            '+' . $qty,
            strtoupper($row['user_role']),
            $details
        ]);
    }
} catch (Exception $e) {
    // CSV output might have already started, so we just finish silently or log error
}

fclose($output);
exit;
