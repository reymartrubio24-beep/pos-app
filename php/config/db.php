<?php
// Simple database connection configuration
$host = 'localhost';
$dbname = 'pos_system';
$username = 'root'; // DEFAULT FOR XAMPP
$password = '';     // DEFAULT FOR XAMPP

try {
    // First, try to connect to the database normally
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);

    // Run migration check: ensure product_name column exists in transaction_items
    $columns = $pdo->query("SHOW COLUMNS FROM transaction_items LIKE 'product_name'")->fetchAll();
    if (empty($columns)) {
        $pdo->exec("ALTER TABLE transaction_items ADD COLUMN product_name VARCHAR(255) NOT NULL DEFAULT '' AFTER product_id");
        // Backfill existing data
        $pdo->exec("
            UPDATE transaction_items ti
            JOIN products p ON ti.product_id = p.id
            SET ti.product_name = p.name
            WHERE ti.product_name = '' OR ti.product_name IS NULL
        ");
    }

} catch (PDOException $e) {
    // If database doesn't exist, auto-create it
    if (strpos($e->getMessage(), 'Unknown database') !== false) {
        try {
            $pdo = new PDO("mysql:host=$host;charset=utf8", $username, $password);
            $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $pdo->exec("CREATE DATABASE IF NOT EXISTS `$dbname`");
            
            // Reconnect to the new database
            $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
            $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);

            // Create all tables
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

            // Seed default users
            $pdo->exec("
                INSERT INTO users (username, password, role, full_name) VALUES 
                ('owner@example.com', '\$2y\$10\$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'owner', 'Admin Owner'),
                ('cashier@example.com', '\$2y\$10\$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'cashier', 'Juan Dela Cruz')
            ");

            // Seed default products
            $pdo->exec("
                INSERT INTO products (name, category, price, stock, low_stock_threshold) VALUES 
                ('Coca-Cola 1.5L', 'Beverages', 65.00, 48, 10),
                ('Sky Flakes Crackers', 'Snacks', 35.00, 120, 20),
                ('Bear Brand Milk 300g', 'Dairy', 85.00, 6, 10),
                ('Lucky Me Pancit Canton', 'Snacks', 18.00, 200, 50),
                ('Gardenia Bread', 'Bread & Bakery', 75.00, 8, 10),
                ('Safeguard Soap', 'Personal Care', 45.00, 3, 10)
            ");
        } catch (PDOException $setupError) {
            die("Auto-setup failed: " . $setupError->getMessage());
        }
    } else {
        die("Error connecting to database: " . $e->getMessage());
    }
}
