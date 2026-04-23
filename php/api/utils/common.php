<?php
// Common initialization for API endpoints
date_default_timezone_set('Asia/Manila');

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

    if ($role) {
        $allowedRoles = is_array($role) ? $role : [$role];
        $currentRole = strtolower(trim((string) ($_SESSION['role'] ?? '')));

        $match = false;
        foreach ($allowedRoles as $r) {
            if (strtolower(trim((string) $r)) === $currentRole) {
                $match = true;
                break;
            }
        }

        if (!$match) {
            sendResponse(['error' => 'Forbidden'], 403);
        }
    }
}

function getJsonInput()
{
    return json_decode(file_get_contents('php://input'), true) ?? [];
}
