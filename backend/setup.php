<?php
// ==========================================================
// Al Muheet Fragrance - Database Setup & Migration Utility
// Usage: php backend/setup.php
// ==========================================================

if (php_sapi_name() !== 'cli') {
    die("This script can only be run from the command line.\n");
}

require_once __DIR__ . '/config/config.php';

echo "====================================================\n";
echo "  Al Muheet Fragrance - Database Setup Tool\n";
echo "====================================================\n\n";

$driver = strtolower(env('DB_DRIVER', 'mysql'));
$host   = env('DB_HOST', '127.0.0.1');
$port   = env('DB_PORT', '3306');
$dbname = env('DB_NAME', 'almuheet_db');
$user   = env('DB_USER', 'root');
$pass   = env('DB_PASS', '');

$schemaPath = dirname(__DIR__) . '/database/schema.sql';
$seedPath   = dirname(__DIR__) . '/database/seed.sql';

if ($driver === 'mysql') {
    echo "[1/3] Connecting to MySQL server at {$host}:{$port}...\n";
    try {
        // Connect without dbname to create database if not present
        $pdo = new PDO("mysql:host={$host};port={$port};charset=utf8mb4", $user, $pass, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
        ]);
        echo "      Connected to MySQL successfully.\n";

        echo "[2/3] Ensuring database '{$dbname}' exists...\n";
        $pdo->exec("CREATE DATABASE IF NOT EXISTS `{$dbname}` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;");
        $pdo->exec("USE `{$dbname}`;");

        echo "[3/3] Executing schema.sql and seed.sql...\n";
        if (file_exists($schemaPath)) {
            $schemaSql = file_get_contents($schemaPath);
            $pdo->exec($schemaSql);
            echo "      Schema imported successfully.\n";
        }
        if (file_exists($seedPath)) {
            $seedSql = file_get_contents($seedPath);
            $pdo->exec($seedSql);
            echo "      Seed data imported successfully.\n";
        }

        echo "\n[SUCCESS] MySQL Database setup completed for Al Muheet Fragrance!\n";
        echo "Database: {$dbname} on {$host}:{$port}\n";

    } catch (PDOException $e) {
        echo "\n[WARNING] Could not connect to MySQL: " . $e->getMessage() . "\n";
        echo "Checking local SQLite fallback...\n";
        setupSqlite();
    }
} else {
    setupSqlite();
}

function setupSqlite() {
    require_once __DIR__ . '/config/database.php';
    echo "Initializing local SQLite database...\n";
    $pdo = Database::getConnection();
    echo "\n[SUCCESS] Local database ready (Driver: " . Database::getDriverUsed() . ")!\n";
    echo "Location: database/almuheet.sqlite\n";
}

echo "\nDefault Local Admin:\n";
echo "  URL:      http://localhost:5173/admin/login\n";
echo "  Email:    admin@almuheet.store\n";
echo "  Password: Admin@12345\n\n";
echo "To set a custom admin password, run:\n";
echo "  php backend/create_admin.php\n";
