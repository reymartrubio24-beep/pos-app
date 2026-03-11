<?php
require_once '../../config/db.php';
require_once '../utils/common.php';

checkAuth('owner');

try {
    $pdo->beginTransaction();

    // 1. Delete tanang transaction items
    $pdo->exec("DELETE FROM transaction_items");

    // 2. Delete tanang transactions
    $pdo->exec("DELETE FROM transactions");

    // 3. Add a log kag entry nga nag-clear sa sales records (transactions)
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
