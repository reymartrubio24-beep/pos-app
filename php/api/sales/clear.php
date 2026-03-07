<?php
require_once '../../config/db.php';
require_once '../utils/common.php';

checkAuth('owner');

try {
    $pdo->beginTransaction();

    // 1. Delete all items first (integrity)
    $pdo->exec("DELETE FROM transaction_items");

    // 2. Delete all transactions
    $pdo->exec("DELETE FROM transactions");

    // 3. Add a log for the action
    $stmt = $pdo->prepare("INSERT INTO audit_logs (user_id, action, details) VALUES (?, ?, ?)");
    $stmt->execute([$_SESSION['user_id'], 'System', 'Cleared all sales records (Transactions)']);

    $pdo->commit();
    sendResponse(['success' => true]);
} catch (Exception $e) {
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }
    sendResponse(['success' => false, 'error' => $e->getMessage()], 500);
}
