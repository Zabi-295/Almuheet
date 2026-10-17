<?php
require_once __DIR__ . '/config/database.php';

$db = Database::getConnection();

// Check existing columns in orders table
$columns = [];
$stmt = $db->query("PRAGMA table_info(orders)");
while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
    $columns[] = $row['name'];
}

$columnsToAdd = [
    'tracking_number' => 'TEXT NULL',
    'courier_name'    => 'TEXT NULL',
    'payment_status'  => 'TEXT DEFAULT "pending"',
    'admin_notes'     => 'TEXT NULL'
];

foreach ($columnsToAdd as $col => $type) {
    if (!in_array($col, $columns)) {
        try {
            $db->exec("ALTER TABLE orders ADD COLUMN {$col} {$type}");
            echo "Added column '{$col}' to orders table.\n";
        } catch (Exception $e) {
            echo "Error adding '{$col}': " . $e->getMessage() . "\n";
        }
    } else {
        echo "Column '{$col}' already exists.\n";
    }
}

echo "Orders table migration complete.\n";
