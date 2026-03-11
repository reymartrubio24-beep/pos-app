<?php
require_once '../../config/db.php';
require_once '../utils/common.php';

checkAuth('owner');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = getJsonInput();
    $username = $data['username'] ?? null;
    $full_name = $data['full_name'] ?? null;
    $role = $data['role'] ?? 'cashier';
    $password = $data['password'] ?? null;

    if (!$username || !$full_name || !$password) {
        sendResponse(['error' => 'All fields (Username, Full Name, Password) are required.'], 400);
    }

    try {
        // Check if ang username is nag exixts na ba
        $stmt = $pdo->prepare("SELECT id FROM users WHERE username = ?");
        $stmt->execute([$username]);
        if ($stmt->fetch()) {
            sendResponse(['error' => 'Username already exists.'], 409);
        }

        // Insert new user
        $hashed_password = password_hash($password, PASSWORD_DEFAULT);
        $stmt = $pdo->prepare("INSERT INTO users (username, full_name, role, password) VALUES (?, ?, ?, ?)");
        $stmt->execute([$username, $full_name, $role, $hashed_password]);

        $new_user_id = $pdo->lastInsertId();

        // Audit Log
        $auditStmt = $pdo->prepare("INSERT INTO audit_logs (user_id, action, details) VALUES (?, ?, ?)");
        $auditStmt->execute([$_SESSION['user_id'], 'Create User', "Created new user: $full_name ($username) with role: $role"]);

        sendResponse(['success' => true, 'id' => $new_user_id, 'message' => 'User created successfully.']);
    } catch (Exception $e) {
        sendResponse(['error' => 'Database error: ' . $e->getMessage()], 500);
    }
} else {
    sendResponse(['error' => 'Invalid request method.'], 405);
}
