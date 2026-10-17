<?php
// ==========================================================
// Al Muheet Fragrance - Auth Controller
// ==========================================================

require_once __DIR__ . '/../Auth.php';
require_once __DIR__ . '/../Response.php';
require_once __DIR__ . '/../../config/database.php';

class AuthController {
    public static function login(): void {
        $input = json_decode(file_get_contents('php://input'), true) ?? [];
        $email = trim($input['email'] ?? '');
        $password = $input['password'] ?? '';

        if (empty($email) || empty($password)) {
            Response::error('Email and password are required.', 422);
        }

        $db = Database::getConnection();
        $stmt = $db->prepare("SELECT * FROM admins WHERE email = ? LIMIT 1");
        $stmt->execute([$email]);
        $admin = $stmt->fetch();

        if (!$admin || !password_verify($password, $admin['password'])) {
            Response::error('Invalid email or password.', 401);
        }

        // Update last login timestamp
        $updateStmt = $db->prepare("UPDATE admins SET last_login = " . (Database::getDriverUsed() === 'sqlite' ? "datetime('now')" : "NOW()") . " WHERE id = ?");
        $updateStmt->execute([$admin['id']]);

        // Generate JWT token
        $adminPayload = [
            'id'    => (int)$admin['id'],
            'name'  => $admin['name'],
            'email' => $admin['email'],
            'role'  => $admin['role'] ?? 'admin'
        ];

        $token = Auth::generateToken($adminPayload);

        Response::success([
            'token' => $token,
            'admin' => $adminPayload
        ], 'Authentication successful');
    }

    public static function me(): void {
        $admin = Auth::requireAdmin();
        Response::success($admin, 'Admin profile retrieved');
    }

    public static function logout(): void {
        Response::success(null, 'Logged out successfully');
    }
}
