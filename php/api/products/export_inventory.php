<?php
require_once '../../config/db.php';
require_once '../utils/common.php';

checkAuth(['owner', 'admin', 'cashier']);

header('Content-Type: text/csv');
header('Content-Disposition: attachment; filename="inventory_report_' . date('Ymd_His') . '.csv"');

$output = fopen('php://output', 'w');

// Header
fputcsv($output, ['ID', 'Name', 'Category', 'Price (P)', 'Current Stock', 'Low Stock Threshold', 'Status']);

try {
    $stmt = $pdo->prepare("SELECT * FROM products ORDER BY name ASC");
    $stmt->execute();

    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $status = $row['stock'] <= $row['low_stock_threshold'] ? 'LOW STOCK' : 'IN STOCK';
        if ($row['stock'] <= 0) $status = 'OUT OF STOCK';

        fputcsv($output, [
            '#' . str_pad($row['id'], 4, '0', STR_PAD_LEFT),
            $row['name'],
            $row['category'],
            number_format($row['price'], 2),
            $row['stock'],
            $row['low_stock_threshold'],
            $status
        ]);
    }
} catch (Exception $e) {
    // CSV output might have already started
}

fclose($output);
exit;
