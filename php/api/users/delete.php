<?php
require_once '../../config/db.php';
require_once '../utils/common.php';

checkAuth(['owner', 'admin']);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = getJsonInput();
    $user_id = $data['id'] ?? null;

    if (!$user_id) {
        sendResponse(['error' => 'User ID is required.'], 400);
    }

    // Prevent owner para dili ma delete ang iyang account
    if ($user_id == $_SESSION['user_id']) {
        sendResponse(['error' => 'You cannot delete your own account.'], 403);
    }

    try {
        $pdo->beginTransaction();

        // Check the user to be deleted
        $stmt = $pdo->prepare("SELECT role, full_name, username FROM users WHERE id = ?");
        $stmt->execute([$user_id]);
        $userToDelete = $stmt->fetch();

        if (!$userToDelete) {
            throw new Exception("User not found.");
        }

        // Prevent admin para dili ma delete ang system admin account
        if ($userToDelete['username'] === 'admin') {
            throw new Exception("The system administrator account ('admin') cannot be deleted.");
        }

        //Allow deleting owner only if another owner exists
        if ($userToDelete['role'] === 'owner') {
            $countStmt = $pdo->query("SELECT COUNT(*) FROM users WHERE role = 'owner'");
            $ownerCount = $countStmt->fetchColumn();

            if ($ownerCount <= 1) {
                throw new Exception("Cannot delete the only owner account in the system. Please create another owner account first.");
            }
        }

        // Now safe to delete (related records will automatically have user_id set to NULL)
        $stmt = $pdo->prepare("DELETE FROM users WHERE id = ?");
        $stmt->execute([$user_id]);

        // Audit Log for the deletion itself
        $auditStmt = $pdo->prepare("INSERT INTO audit_logs (user_id, action, details) VALUES (?, ?, ?)");
        $auditStmt->execute([$_SESSION['user_id'], 'Delete User', 'Deleted ' . $userToDelete['role'] . ': ' . $userToDelete['full_name'] . ' (ID: ' . $user_id . ')']);

        $pdo->commit();
        sendResponse(['success' => true, 'message' => 'User deleted successfully.']);
    } catch (Exception $e) {
        if ($pdo->inTransaction()) {
            $pdo->rollBack();
        }
        sendResponse(['error' => 'Deletion failed: ' . $e->getMessage()], 400);
    }
} else {
    sendResponse(['error' => 'Invalid request method.'], 405);
}
