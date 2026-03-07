<?php
require_once '../../config/db.php';
require_once '../utils/common.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = getJsonInput();
    $username = $data['username'] ?? '';
    $password = $data['password'] ?? '';

    if (empty($username) || empty($password)) {
        sendResponse(['error' => 'Username and password are required.'], 400);
    }

    try {
        $stmt = $pdo->prepare("SELECT * FROM users WHERE username = ?");
        $stmt->execute([$username]);
        $user = $stmt->fetch();

        if ($user && password_verify($password, $user['password'])) {
            $_SESSION['user_id'] = $user['id'];
            $_SESSION['username'] = $user['username'];
            $_SESSION['role'] = $user['role'];
            $_SESSION['full_name'] = $user['full_name'] ?? $user['username'];

            // Audit Log
            $auditStmt = $pdo->prepare("INSERT INTO audit_logs (user_id, action, details) VALUES (?, ?, ?)");
            $auditStmt->execute([$user['id'], 'Login', 'User logged in to the system.']);

            sendResponse([
                'success' => true,
                'user' => [
                    'id' => $user['id'],
                    'username' => $user['username'],
                    'role' => $user['role'],
                    'full_name' => $user['full_name'] ?? $user['username'],
                    'avatar_url' => $user['avatar_url']
                ]
            ]);
        } else {
            sendResponse(['error' => 'Invalid username or password.'], 401);
        }
    } catch (Exception $e) {
        sendResponse(['error' => 'Database error occurred.'], 500);
    }
} else {
    sendResponse(['error' => 'Invalid request method.'], 405);
}
