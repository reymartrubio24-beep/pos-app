<?php
require_once '../../config/db.php';
require_once '../utils/common.php';

checkAuth('owner');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = getJsonInput();
    $user_id = $data['id'] ?? null;

    if (!$user_id) {
        sendResponse(['error' => 'User ID is required.'], 400);
    }

    // Prevent owner from deleting themselves
    if ($user_id == $_SESSION['user_id']) {
        sendResponse(['error' => 'You cannot delete your own account.'], 403);
    }

    try {
        $stmt = $pdo->prepare("DELETE FROM users WHERE id = ?");
        $stmt->execute([$user_id]);

        // Audit Log
        $auditStmt = $pdo->prepare("INSERT INTO audit_logs (user_id, action, details) VALUES (?, ?, ?)");
        $auditStmt->execute([$_SESSION['user_id'], 'Delete User', 'Deleted user account with ID: ' . $user_id]);

        sendResponse(['success' => true, 'message' => 'User deleted successfully.']);
    } catch (Exception $e) {
        sendResponse(['error' => 'Database error: ' . $e->getMessage()], 500);
    }
} else {
    sendResponse(['error' => 'Invalid request method.'], 405);
}
