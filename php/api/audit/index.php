<?php
require_once '../../config/db.php';
require_once '../utils/common.php';

checkAuth(['owner', 'admin']);

try {
    $stmt = $pdo->prepare("SELECT a.*, u.full_name as user_name, u.role as user_role FROM audit_logs a JOIN users u ON a.user_id = u.id ORDER BY a.created_at DESC LIMIT 100");
    $stmt->execute();
    $logs = $stmt->fetchAll();
    sendResponse($logs);
} catch (Exception $e) {
    sendResponse(['error' => 'Database error: ' . $e->getMessage()], 500);
}
