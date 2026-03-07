<?php
require_once '../../config/db.php';

/**
 * EMERGENCY RECOVERY TOOL
 * PURPOSE: Resets the first 'owner' account password.
 * SECURITY: DELETE THIS FILE AFTER USE!
 */

header('Content-Type: text/html; charset=utf-8');

try {
    // 1. Find the first owner
    $stmt = $pdo->prepare("SELECT id, username FROM users WHERE role = 'owner' LIMIT 1");
    $stmt->execute();
    $owner = $stmt->fetch();

    if (!$owner) {
        echo "<h2>Error: No account with role 'owner' found in the system.</h2>";
        exit;
    }

    // 2. Set the new temporary password
    $newTempPassword = 'AdminPassword2026!';
    $hashedPassword = password_hash($newTempPassword, PASSWORD_DEFAULT);

    // 3. Update the database
    $update = $pdo->prepare("UPDATE users SET password = ? WHERE id = ?");
    $update->execute([$hashedPassword, $owner['id']]);

    echo "<div style='font-family: sans-serif; padding: 40px; text-align: center;'>";
    echo "<h1 style='color: #10b981;'>Account Recovered Successfully!</h1>";
    echo "<p>The password for owner <strong>" . htmlspecialchars($owner['username']) . "</strong> has been reset.</p>";
    echo "<div style='background: #f1f5f9; padding: 20px; border-radius: 10px; display: inline-block; margin: 20px 0;'>";
    echo "New Password: <strong style='font-size: 20px;'>" . $newTempPassword . "</strong>";
    echo "</div>";
    echo "<p style='color: #ef4444; font-weight: bold;'>CRITICAL: Please delete this file (recovery.php) now to prevent unauthorized access!</p>";
    echo "</div>";

} catch (Exception $e) {
    echo "Recovery failed: " . $e->getMessage();
}
