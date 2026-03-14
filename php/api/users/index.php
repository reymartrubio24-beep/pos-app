<?php
require_once '../../config/db.php';
require_once '../utils/common.php';

checkAuth(['owner', 'admin']);

try {
    $stmt = $pdo->query("SELECT id, username, role, full_name, created_at FROM users ORDER BY created_at DESC");
    $users = $stmt->fetchAll();
    sendResponse($users);
} catch (Exception $e) {
    sendResponse(['error' => 'Database error: ' . $e->getMessage()], 500);
}
