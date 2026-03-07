<?php
// Simple database connection configuration
$host = 'localhost';
$dbname = 'pos_system';
$username = 'root'; // DEFAULT FOR XAMPP
$password = '';     // DEFAULT FOR XAMPP

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
} catch (PDOException $e) {
    die("Error connecting to database: " . $e->getMessage());
}
