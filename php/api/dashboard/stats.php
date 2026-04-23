<?php
require_once '../../config/db.php';
require_once '../utils/common.php';

checkAuth();

function getStats($pdo, $condition, $params = []) {
    $stmt = $pdo->prepare("SELECT SUM(total) as revenue, COUNT(*) as count FROM transactions WHERE $condition");
    $stmt->execute($params);
    $res = $stmt->fetch();
    return [
        'revenue' => (float)($res['revenue'] ?? 0),
        'count' => (int)($res['count'] ?? 0)
    ];
}

function calculateTrend($current, $previous) {
    if ($previous == 0) return $current > 0 ? 100 : 0;
    return round((($current - $previous) / $previous) * 100, 1);
}

// Date ranges
$todayDate = date('Y-m-d');
$yesterdayDate = date('Y-m-d', strtotime('-1 day'));

// Today vs Yesterday
$today = getStats($pdo, "DATE(created_at) = ?", [$todayDate]);
$yesterday = getStats($pdo, "DATE(created_at) = ?", [$yesterdayDate]);

// Rolling Week (Last 7 Days including today) vs Previous 7 Days
// This ensures 'This Week' on dashboard matches the sum of the 'Weekly Revenue' chart
$thisWeek = getStats($pdo, "DATE(created_at) >= ?", [date('Y-m-d', strtotime('-6 days'))]);
$lastWeek = getStats($pdo, "DATE(created_at) >= ? AND DATE(created_at) < ?", [
    date('Y-m-d', strtotime('-13 days')),
    date('Y-m-d', strtotime('-6 days'))
]);

// This Month vs Last Month
$thisMonthStart = date('Y-m-01');
$lastMonthStart = date('Y-m-01', strtotime('-1 month'));
$lastMonthEnd = date('Y-m-t', strtotime('-1 month'));

$thisMonth = getStats($pdo, "DATE(created_at) >= ?", [$thisMonthStart]);
$lastMonth = getStats($pdo, "DATE(created_at) >= ? AND DATE(created_at) <= ?", [$lastMonthStart, $lastMonthEnd]);

// Chart Data: Optimized to single query
$startDate = date('Y-m-d', strtotime('-6 days'));
$stmt = $pdo->prepare("
    SELECT DATE(created_at) as date, SUM(total) as revenue 
    FROM transactions 
    WHERE DATE(created_at) >= ? 
    GROUP BY DATE(created_at)
    ORDER BY date ASC
");
$stmt->execute([$startDate]);
$dbChartData = $stmt->fetchAll(PDO::FETCH_KEY_PAIR);

$chartData = [];
for ($i = 6; $i >= 0; $i--) {
    $date = date('Y-m-d', strtotime("-$i days"));
    $chartData[] = [
        'date' => $date,
        'revenue' => (float)($dbChartData[$date] ?? 0)
    ];
}

// Low Stock Alerts
$lowStockStmt = $pdo->prepare("SELECT * FROM products WHERE stock <= low_stock_threshold");
$lowStockStmt->execute();
$lowStockItems = $lowStockStmt->fetchAll();

// Recent Transactions
$recentStmt = $pdo->prepare("
    SELECT t.*, u.full_name as cashier_name,
    (SELECT IFNULL(SUM(quantity), 0) FROM transaction_items WHERE transaction_id = t.id) as item_count
    FROM transactions t 
    LEFT JOIN users u ON t.user_id = u.id 
    ORDER BY t.created_at DESC 
    LIMIT 5
");
$recentStmt->execute();
$recentTransactions = $recentStmt->fetchAll();

sendResponse([
    'today' => $today,
    'week' => $thisWeek,
    'month' => $thisMonth,
    'trends' => [
        'today' => calculateTrend($today['revenue'], $yesterday['revenue']),
        'week' => calculateTrend($thisWeek['revenue'], $lastWeek['revenue']),
        'month' => calculateTrend($thisMonth['revenue'], $lastMonth['revenue']),
        'avg' => calculateTrend(
            $today['count'] > 0 ? $today['revenue'] / $today['count'] : 0, 
            $yesterday['count'] > 0 ? $yesterday['revenue'] / $yesterday['count'] : 0
        )
    ],
    'lowStock' => $lowStockItems,
    'chart' => $chartData,
    'recent' => $recentTransactions
]);
