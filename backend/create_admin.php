<?php
// ==========================================================
// Al Muheet Fragrance - Administrator Creation Utility (CLI)
// Usage:
//   php backend/create_admin.php
//   php backend/create_admin.php "Hamza Khan" "admin@almuheet.store" "SecurePass123"
// ==========================================================

if (php_sapi_name() !== 'cli') {
    die("This script can only be run from the command line.\n");
}

require_once __DIR__ . '/config/database.php';

echo "====================================================\n";
echo "  Al Muheet Fragrance - Create Administrator Account\n";
echo "====================================================\n\n";

$name = $argv[1] ?? null;
$email = $argv[2] ?? null;
$password = $argv[3] ?? null;

if (!$name) {
    echo "Enter Administrator Name [Store Admin]: ";
    $name = trim(fgets(STDIN)) ?: "Store Admin";
}

if (!$email) {
    echo "Enter Administrator Email [admin@almuheet.store]: ";
    $email = trim(fgets(STDIN)) ?: "admin@almuheet.store";
}

if (!$password) {
    echo "Enter Secure Password: ";
    $password = trim(fgets(STDIN));
    if (empty($password)) {
        die("Error: Password cannot be empty.\n");
    }
}

$hash = password_hash($password, PASSWORD_BCRYPT);
$db = Database::getConnection();

try {
    $stmt = $db->prepare("SELECT id FROM admins WHERE email = ?");
    $stmt->execute([$email]);
    $existing = $stmt->fetch();

    if ($existing) {
        $update = $db->prepare("UPDATE admins SET name = ?, password = ?, role = 'superadmin' WHERE id = ?");
        $update->execute([$name, $hash, $existing['id']]);
        echo "\n[SUCCESS] Updated existing administrator ({$email}) with the new password.\n";
    } else {
        $insert = $db->prepare("INSERT INTO admins (name, email, password, role) VALUES (?, ?, ?, 'superadmin')");
        $insert->execute([$name, $email, $hash]);
        echo "\n[SUCCESS] Created new superadministrator account successfully!\n";
    }

    echo "Email:    {$email}\n";
    echo "Role:     superadmin\n";
    echo "Database: " . Database::getDriverUsed() . "\n";
    echo "\nYou can now log in at: http://localhost:5173/admin/login\n";

} catch (Exception $e) {
    echo "\n[ERROR] Failed to save administrator: " . $e->getMessage() . "\n";
}
