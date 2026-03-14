<?php
require_once '../../config/db.php';
require_once '../utils/common.php';

checkAuth(['owner', 'admin']);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = getJsonInput();
    $user_id = $data['id'] ?? null;
    $new_username = $data['username'] ?? null;
    $new_full_name = $data['full_name'] ?? null;
    $new_role = $data['role'] ?? null;
    $new_password = $data['password'] ?? null;

    if (!$user_id) {
        sendResponse(['error' => 'User ID is required.'], 400);
    }

    try {
        // Fetch ang current username sa user para ma-check nimo kung nag change ba siya og username, if yes, then i-check nimo if ang new username kay existing na ba sa system
        $stmt = $pdo->prepare("SELECT username FROM users WHERE id = ?");
        $stmt->execute([$user_id]);
        $user = $stmt->fetch();

        if (!$user) {
            sendResponse(['error' => 'User not found.'], 404);
        }

        // Check if ang username kay gi-change ba, if yes, then i-check nimo if ang new username kay existing na ba sa system (excluding sa current user)
        if ($new_username && $new_username !== $user['username']) {
            // Prevent renaming the admin account
            if ($user['username'] === 'admin') {
                sendResponse(['error' => 'The system administrator username ("admin") cannot be changed.'], 403);
            }

            $stmt = $pdo->prepare("SELECT id FROM users WHERE username = ? AND id != ?");
            $stmt->execute([$new_username, $user_id]);
            if ($stmt->fetch()) {
                sendResponse(['error' => 'Username already exists.'], 409);
            }
        }

        // Build update query dynamically
        $updates = [];
        $params = [];

        if ($new_username) {
            $updates[] = "username = ?";
            $params[] = $new_username;
        }
        if ($new_full_name) {
            $updates[] = "full_name = ?";
            $params[] = $new_full_name;
        }
        if ($new_role) {
            $updates[] = "role = ?";
            $params[] = $new_role;
        }
        if ($new_password && !empty($new_password)) {
            $updates[] = "password = ?";
            $params[] = password_hash($new_password, PASSWORD_DEFAULT);
        }

        if (empty($updates)) {
            sendResponse(['error' => 'No changes provided.'], 400);
        }

        $params[] = $user_id;
        $sql = "UPDATE users SET " . implode(', ', $updates) . " WHERE id = ?";
        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);

        // Audit Log
        $auditStmt = $pdo->prepare("INSERT INTO audit_logs (user_id, action, details) VALUES (?, ?, ?)");
        $auditStmt->execute([$_SESSION['user_id'], 'Update User', 'Updated account details for user ID: ' . $user_id]);

        sendResponse(['success' => true, 'message' => 'User updated successfully.']);
    } catch (Exception $e) {
        sendResponse(['error' => 'Database error: ' . $e->getMessage()], 500);
    }
} else {
    sendResponse(['error' => 'Invalid request method.'], 405);
}
