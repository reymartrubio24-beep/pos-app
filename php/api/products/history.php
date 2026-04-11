<?php
require_once '../../config/db.php';
require_once '../utils/common.php';

checkAuth();

$product_name = $_GET['name'] ?? '';

if (empty($product_name)) {
    sendResponse(['error' => 'Product name is required'], 400);
}

try {
    // Filter audit logs for this specific product
    // We look for both 'Inventory' and 'Transaction' actions that mention this product
    $stmt = $pdo->prepare("
        SELECT a.*, u.full_name as user_name, u.role as user_role 
        FROM audit_logs a 
        JOIN users u ON a.user_id = u.id 
        WHERE (a.action = 'Inventory' OR a.action = 'Transaction') 
        AND a.details LIKE ? 
        ORDER BY a.created_at DESC 
        LIMIT 100
    ");
    
    // We use LIKE %Name% but we should be careful about partial matches (e.g. "Cake" matching "Cupcake")
    // For now, given the limited scope, name-based search is the intended approach for existing logs.
    $stmt->execute(['%' . $product_name . '%']);
    $logs = $stmt->fetchAll();
    
    // Process logs to extract product name and quantity for table view
    foreach ($logs as &$log) {
        $details = $log['details'];
        
        // Extract product name and quantity for Restock events
        if ($log['action'] === 'Inventory' && strpos($details, 'Restocked') !== false) {
            preg_match('/Restocked (.*?): \+([\d.]+)/', $details, $matches);
            $log['product_name'] = $matches[1] ?? 'Unknown Item';
            $log['quantity_added'] = $matches[2] ?? '0';
            
            // Extract old stock if it exists in the details (newer logs only)
            if (preg_match('/Old:\s*([\d.]+)/', $details, $oldMatches)) {
               $log['old_stock'] = $oldMatches[1];
            } else {
               $log['old_stock'] = '0';
            }
        } 
        // For Transactions, we might want to extract quantity too, but usually it's "Product (Qty)"
        else {
            $log['product_name'] = $product_name; // Default for specific history
            $log['quantity_added'] = '0';
            $log['old_stock'] = '0';
        }
    }
    
    sendResponse($logs);
} catch (Exception $e) {
    sendResponse(['error' => 'Database error: ' . $e->getMessage()], 500);
}
