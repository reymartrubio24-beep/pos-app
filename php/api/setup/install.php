<?php
// Auto-setup: Creates the database and tables automatically
// This script is safe to run multiple times - it uses IF NOT EXISTS

header('Content-Type: application/json');

$host = 'localhost';
$username = 'root';
$password = '';
$dbname = 'pos_system';

try {
    // Step 1: Connect WITHOUT database to create it if needed
    $pdo = new PDO("mysql:host=$host;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Step 2: Create database
    $pdo->exec("CREATE DATABASE IF NOT EXISTS `$dbname`");
    $pdo->exec("USE `$dbname`");

    // Step 3: Create all tables
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            username VARCHAR(50) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL,
            role ENUM('owner', 'cashier') NOT NULL,
            full_name VARCHAR(100) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ");

    $pdo->exec("
        CREATE TABLE IF NOT EXISTS products (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            category VARCHAR(100) NOT NULL,
            price DECIMAL(10, 2) NOT NULL,
            stock INT NOT NULL DEFAULT 0,
            low_stock_threshold INT DEFAULT 5,
            image_url VARCHAR(255),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ");

    $pdo->exec("
        CREATE TABLE IF NOT EXISTS transactions (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT,
            total DECIMAL(10, 2) NOT NULL,
            vat DECIMAL(10, 2) NOT NULL,
            subtotal DECIMAL(10, 2) NOT NULL,
            payment_method VARCHAR(50) DEFAULT 'Cash',
            amount_received DECIMAL(10, 2) DEFAULT 0.00,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id)
        )
    ");

    $pdo->exec("
        CREATE TABLE IF NOT EXISTS transaction_items (
            id INT AUTO_INCREMENT PRIMARY KEY,
            transaction_id INT,
            product_id INT,
            product_name VARCHAR(255) NOT NULL DEFAULT '',
            quantity INT NOT NULL,
            price_at_time DECIMAL(10, 2) NOT NULL,
            FOREIGN KEY (transaction_id) REFERENCES transactions(id),
            FOREIGN KEY (product_id) REFERENCES products(id)
        )
    ");

    $pdo->exec("
        CREATE TABLE IF NOT EXISTS audit_logs (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT,
            action VARCHAR(255) NOT NULL,
            details TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id)
        )
    ");

    // Step 4: Migration - Add product_name column if it doesn't exist (for existing databases)
    $columns = $pdo->query("SHOW COLUMNS FROM transaction_items LIKE 'product_name'")->fetchAll();
    if (empty($columns)) {
        $pdo->exec("ALTER TABLE transaction_items ADD COLUMN product_name VARCHAR(255) NOT NULL DEFAULT '' AFTER product_id");
        $pdo->exec("UPDATE transaction_items ti JOIN products p ON ti.product_id = p.id SET ti.product_name = p.name WHERE ti.product_name = '' OR ti.product_name IS NULL");
    }

    // Step 5: Migration - Add payment_method and amount_received to transactions
    $cols = $pdo->query("SHOW COLUMNS FROM transactions LIKE 'payment_method'")->fetchAll();
    if (empty($cols)) {
        $pdo->exec("ALTER TABLE transactions ADD COLUMN payment_method VARCHAR(50) DEFAULT 'Cash' AFTER subtotal");
    }
    
    $cols = $pdo->query("SHOW COLUMNS FROM transactions LIKE 'amount_received'")->fetchAll();
    if (empty($cols)) {
        $pdo->exec("ALTER TABLE transactions ADD COLUMN amount_received DECIMAL(10, 2) DEFAULT 0.00 AFTER payment_method");
    }
    
    $cols = $pdo->query("SHOW COLUMNS FROM transactions LIKE 'product_names'")->fetchAll();
    if (empty($cols)) {
        $pdo->exec("ALTER TABLE transactions ADD COLUMN product_names TEXT AFTER amount_received");
    }
    
    // Always run this to update records to the new "Name (Qty)" format
    $pdo->exec("
        UPDATE transactions t
        JOIN (
            SELECT transaction_id, 
            GROUP_CONCAT(CONCAT(product_name, ' (', quantity, ')') SEPARATOR ', ') as names
            FROM transaction_items
            GROUP BY transaction_id
        ) ti ON t.id = ti.transaction_id
        SET t.product_names = ti.names
    ");

    // Step 5: Seed default users if table is empty
    $userCount = $pdo->query("SELECT COUNT(*) FROM users")->fetchColumn();
    if ($userCount == 0) {
        $pdo->exec("
            INSERT INTO users (username, password, role, full_name) VALUES 
            ('owner@example.com', '\$2y\$10\$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'owner', 'Admin Owner'),
            ('cashier@example.com', '\$2y\$10\$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'cashier', 'Juan Dela Cruz')
        ");
    }

    // Step 6: Seed default products if table is empty
    $productCount = $pdo->query("SELECT COUNT(*) FROM products")->fetchColumn();
    if ($productCount == 0) {
        $pdo->exec("
            INSERT INTO products (name, category, price, stock, low_stock_threshold) VALUES 
            ('Coca-Cola 1.5L', 'Beverages', 65.00, 48, 10),
            ('Sky Flakes Crackers', 'Snacks', 35.00, 120, 20),
            ('Bear Brand Milk 300g', 'Dairy', 85.00, 6, 10),
            ('Lucky Me Pancit Canton', 'Snacks', 18.00, 200, 50),
            ('Gardenia Bread', 'Bread & Bakery', 75.00, 8, 10),
            ('Safeguard Soap', 'Personal Care', 45.00, 3, 10)
        ");
    }

    // Add UNIQUE constraint on product name if not already present
    $indexes = $pdo->query("SHOW INDEX FROM products WHERE Key_name = 'unique_product_name'")->fetchAll();
    if (empty($indexes)) {
        // Check for existing duplicates first
        $dupes = $pdo->query("SELECT LOWER(name) as lname, COUNT(*) as cnt FROM products GROUP BY LOWER(name) HAVING cnt > 1")->fetchAll();
        if (empty($dupes)) {
            $pdo->exec("ALTER TABLE products ADD UNIQUE INDEX unique_product_name (name)");
        }
    }

    // Add last_restock to products
    $cols = $pdo->query("SHOW COLUMNS FROM products LIKE 'last_restock'")->fetchAll();
    if (empty($cols)) {
        $pdo->exec("ALTER TABLE products ADD COLUMN last_restock TIMESTAMP NULL AFTER image_url");
    }
    
    $cols = $pdo->query("SHOW COLUMNS FROM products LIKE 'last_stock_before'")->fetchAll();
    if (empty($cols)) {
        $pdo->exec("ALTER TABLE products ADD COLUMN last_stock_before INT DEFAULT 0 AFTER last_restock");
    }
    
    $cols = $pdo->query("SHOW COLUMNS FROM products LIKE 'last_stock_added'")->fetchAll();
    if (empty($cols)) {
        $pdo->exec("ALTER TABLE products ADD COLUMN last_stock_added INT DEFAULT 0 AFTER last_stock_before");
    }

    echo json_encode([
        'success' => true, 
        'message' => 'Database setup complete! All tables are ready.'
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false, 
        'error' => 'Setup failed: ' . $e->getMessage()
    ]);
}
