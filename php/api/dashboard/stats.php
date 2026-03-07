<?php
require_once '../../config/db.php';
require_once '../utils/common.php';

checkAuth();

// Today's Revenue
$todayStmt = $pdo->prepare("SELECT SUM(total) as revenue, COUNT(*) as count FROM transactions WHERE DATE(created_at) = CURDATE()");
$todayStmt->execute();
$todayStats = $todayStmt->fetch();

// This Week's Revenue
$weekStmt = $pdo->prepare("SELECT SUM(total) as revenue, COUNT(*) as count FROM transactions WHERE YEARWEEK(created_at, 1) = YEARWEEK(CURDATE(), 1)");
$weekStmt->execute();
$weekStats = $weekStmt->fetch();

// This Month's Revenue
$monthStmt = $pdo->prepare("SELECT SUM(total) as revenue, COUNT(*) as count FROM transactions WHERE MONTH(created_at) = MONTH(CURDATE()) AND YEAR(created_at) = YEAR(CURDATE())");
$monthStmt->execute();
$monthStats = $monthStmt->fetch();

// Low Stock Alerts
$lowStockStmt = $pdo->prepare("SELECT * FROM products WHERE stock <= low_stock_threshold");
$lowStockStmt->execute();
$lowStockItems = $lowStockStmt->fetchAll();

// Daily Sales for Charting
$chartStmt = $pdo->prepare("SELECT DATE(created_at) as date, SUM(total) as revenue FROM transactions WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 7 DAY) GROUP BY DATE(created_at) ORDER BY date");
$chartStmt->execute();
$chartData = $chartStmt->fetchAll();

// Recent Transactions
$recentStmt = $pdo->prepare("SELECT t.*, u.full_name as cashier_name FROM transactions t JOIN users u ON t.user_id = u.id ORDER BY t.created_at DESC LIMIT 5");
$recentStmt->execute();
$recentTransactions = $recentStmt->fetchAll();

sendResponse([
    'today' => $todayStats,
    'week' => $weekStats,
    'month' => $monthStats,
    'lowStock' => $lowStockItems,
    'chart' => $chartData,
    'recent' => $recentTransactions
]);
