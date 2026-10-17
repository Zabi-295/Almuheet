<?php
// ==========================================================
// Al Muheet Fragrance - Store Settings Controller
// Configurable Brand Name, Currency, COD Rules & Contact Info
// ==========================================================

require_once __DIR__ . '/../Auth.php';
require_once __DIR__ . '/../Response.php';
require_once __DIR__ . '/../../config/database.php';

class SettingsController {
    public static function getPublic(): void {
        $db = Database::getConnection();
        $stmt = $db->query("SELECT key_name, value_text FROM settings");
        $settings = $stmt->fetchAll(PDO::FETCH_KEY_PAIR);

        Response::success($settings, 'Store settings loaded');
    }

    public static function update(): void {
        Auth::requireAdmin();
        $input = json_decode(file_get_contents('php://input'), true) ?? [];

        if (empty($input) || !is_array($input)) {
            Response::error('Invalid settings payload.', 422);
        }

        $db = Database::getConnection();
        $isSqlite = Database::getDriverUsed() === 'sqlite';

        if ($isSqlite) {
            $stmt = $db->prepare("
                INSERT INTO settings (key_name, value_text, updated_at) 
                VALUES (?, ?, datetime('now'))
                ON CONFLICT(key_name) DO UPDATE SET value_text = excluded.value_text, updated_at = datetime('now')
            ");
        } else {
            $stmt = $db->prepare("
                INSERT INTO settings (key_name, value_text) 
                VALUES (?, ?)
                ON DUPLICATE KEY UPDATE value_text = VALUES(value_text)
            ");
        }

        foreach ($input as $key => $val) {
            $stmt->execute([$key, (string)$val]);
        }

        // Return updated settings
        $fetchStmt = $db->query("SELECT key_name, value_text FROM settings");
        $updated = $fetchStmt->fetchAll(PDO::FETCH_KEY_PAIR);

        Response::success($updated, 'Store settings updated successfully');
    }
}
