<?php
// Common initialization for API endpoints

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// Suppress errors and warnings that could break JSON response
error_reporting(0);
ini_set('display_errors', 0);

header('Content-Type: application/json');

function sendResponse($data, $statusCode = 200)
{
    http_response_code($statusCode);
    echo json_encode($data);
    exit;
}

function checkAuth($role = null)
{
    if (!isset($_SESSION['user_id'])) {
        sendResponse(['error' => 'Unauthorized'], 401);
    }

    if ($role && $_SESSION['role'] !== $role) {
        sendResponse(['error' => 'Forbidden: Access denied for ' . $_SESSION['role']], 403);
    }
}

function getJsonInput()
{
    return json_decode(file_get_contents('php://input'), true) ?? [];
}
