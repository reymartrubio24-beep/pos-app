<?php
require_once '../../config/db.php';
require_once '../utils/common.php';

checkAuth();

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_FILES['avatar'])) {
    $userId = $_SESSION['user_id'];
    $file = $_FILES['avatar'];

    // Validate file type
    $allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!in_array($file['type'], $allowedTypes)) {
        sendResponse(['error' => 'Invalid file type. Only JPG, PNG, GIF, and WEBP allowed.'], 400);
    }

    // Validate file size (5MB)
    if ($file['size'] > 5 * 1024 * 1024) {
        sendResponse(['error' => 'File size too large. Maximum 5MB.'], 400);
    }

    // Define upload directory relative to this script
    // We want it to be in pos-app/php/uploads/avatars/ to match the products pattern
    $uploadDir = dirname(__DIR__, 2) . DIRECTORY_SEPARATOR . 'uploads' . DIRECTORY_SEPARATOR . 'avatars' . DIRECTORY_SEPARATOR;

    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0777, true);
    }

    // Generate unique name
    $extension = pathinfo($file['name'], PATHINFO_EXTENSION);
    $filename = 'avatar_' . $userId . '_' . time() . '.' . $extension;
    $targetPath = $uploadDir . $filename;

    // Path to store in DB - relative to the web root or consistent with how TopBar builds it
    // If we save in php/uploads/avatars, then the URL should be /php/uploads/avatars/filename
    $dbPath = '/php/uploads/avatars/' . $filename;

    if (move_uploaded_file($file['tmp_name'], $targetPath)) {
        try {
            // Update database
            $stmt = $pdo->prepare("UPDATE users SET avatar_url = ? WHERE id = ?");
            $stmt->execute([$dbPath, $userId]);

            // Update session data
            $_SESSION['avatar_url'] = $dbPath;

            sendResponse([
                'success' => true,
                'avatar_url' => $dbPath,
                'message' => 'Profile picture updated successfully!'
            ]);
        } catch (Exception $e) {
            sendResponse(['error' => 'Database update failed: ' . $e->getMessage()], 500);
        }
    } else {
        sendResponse(['error' => 'Failed to move uploaded file. Check directory permissions.'], 500);
    }
} else {
    sendResponse(['error' => 'No file uploaded or invalid request.'], 400);
}
