<?php
require_once '../../config/db.php';
require_once '../utils/common.php';

checkAuth('owner');

try {
    $pdo->exec("DELETE FROM audit_logs");

    // Add a log for the action itself
    $stmt = $pdo->prepare("INSERT INTO audit_logs (user_id, action, details) VALUES (?, ?, ?)");
    $stmt->execute([$_SESSION['user_id'], 'System', 'Cleared all audit logs']);

    sendResponse(['success' => true]);
} catch (Exception $e) {
    sendResponse(['success' => false, 'error' => $e->getMessage()], 500);
}
