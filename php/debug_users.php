<?php
$pdo = new PDO('mysql:host=localhost;dbname=pos_system_v2', 'root', '');
$stmt = $pdo->query('SELECT username, avatar_url FROM users');
while ($row = $stmt->fetch()) {
    echo $row['username'] . " -> " . $row['avatar_url'] . PHP_EOL;
}
