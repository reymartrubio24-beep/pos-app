<?php
require_once '../../config/db.php';
require_once '../utils/common.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = getJsonInput();
    $username = $data['username'] ?? '';
    $password = $data['password'] ?? '';
    $full_name = $data['full_name'] ?? '';
    $role = $data['role'] ?? 'cashier'; // Default role is cashier

    if (empty($username) || empty($password) || empty($full_name)) {
        sendResponse(['error' => 'All fields are required.'], 400);
    }

    try {
        // Check if username already exists
        $stmt = $pdo->prepare("SELECT id FROM users WHERE username = ?");
        $stmt->execute([$username]);
        if ($stmt->fetch()) {
            sendResponse(['error' => 'Username already exists.'], 409);
        }

        // Hash password
        $hashed_password = password_hash($password, PASSWORD_DEFAULT);

        // Insert new user
        $stmt = $pdo->prepare("INSERT INTO users (username, password, role, full_name) VALUES (?, ?, ?, ?)");
        $stmt->execute([$username, $hashed_password, $role, $full_name]);
        $user_id = $pdo->lastInsertId();

        // Audit Log
        $auditStmt = $pdo->prepare("INSERT INTO audit_logs (user_id, action, details) VALUES (?, ?, ?)");
        $auditStmt->execute([$user_id, 'Registration', 'New user registered: ' . $username]);

        sendResponse([
            'success' => true,
            'message' => 'Registration successful! You can now log in.'
        ]);
    } catch (Exception $e) {
        sendResponse(['error' => 'Database error occurred: ' . $e->getMessage()], 500);
    }
} else {
    sendResponse(['error' => 'Invalid request method.'], 405);
}
