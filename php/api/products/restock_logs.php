<?php
require_once '../../config/db.php';
require_once '../utils/common.php';

checkAuth(['owner', 'admin', 'cashier']);

try {
    // Fetch all Inventory audit logs that involve restocking
    // We filter for logs containing 'Restocked' in details
    $stmt = $pdo->prepare("
        SELECT a.*, u.full_name as user_name, u.role as user_role 
        FROM audit_logs a 
        JOIN users u ON a.user_id = u.id 
        WHERE a.action = 'Inventory' 
        AND a.details LIKE '%Restocked%'
        ORDER BY a.created_at DESC 
        LIMIT 200
    ");
    
    $stmt->execute();
    $logs = $stmt->fetchAll();
    
    // Process the details to extract product name and quantity for easier table display
    foreach ($logs as &$log) {
        $details = $log['details'];
        
        // Extract product name: "Restocked Name: +Quantity units..."
        // Format from manage.php: "Restocked $name: +$diff units (Old: ..., New: ...)"
        preg_match('/Restocked (.*?): \+([\d.]+)/', $details, $matches);
        
        $log['product_name'] = $matches[1] ?? 'Unknown Item';
        $log['quantity_added'] = $matches[2] ?? '0';
        
        if (preg_match('/Old:\s*([\d.]+)/', $details, $oldMatches)) {
           $log['old_stock'] = $oldMatches[1];
        } else {
           $log['old_stock'] = '0';
        }
    }
    
    sendResponse($logs);
} catch (Exception $e) {
    sendResponse(['error' => 'Database error: ' . $e->getMessage()], 500);
}
