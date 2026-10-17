<?php
// ==========================================================
// Al Muheet Fragrance - Authentication & Security Handler
// Cryptographic HMAC-SHA256 Token Engine for Admin API Protection
// ==========================================================

require_once __DIR__ . '/Response.php';
require_once __DIR__ . '/../config/database.php';

class Auth {
    private static function base64UrlEncode(string $data): string {
        return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
    }

    private static function base64UrlDecode(string $data): string {
        return base64_decode(str_pad(strtr($data, '-_', '+/'), strlen($data) % 4 === 0 ? strlen($data) : strlen($data) + 4 - (strlen($data) % 4), '=', STR_PAD_RIGHT));
    }

    public static function generateToken(array $adminData, int $ttl = 604800): string { // 7 days TTL
        $secret = env('JWT_SECRET', 'al_muheet_default_secret_key_38475892');
        
        $header = ['typ' => 'JWT', 'alg' => 'HS256'];
        $payload = array_merge($adminData, [
            'iat' => time(),
            'exp' => time() + $ttl
        ]);

        $encodedHeader = self::base64UrlEncode(json_encode($header));
        $encodedPayload = self::base64UrlEncode(json_encode($payload));
        
        $signature = hash_hmac('sha256', "{$encodedHeader}.{$encodedPayload}", $secret, true);
        $encodedSignature = self::base64UrlEncode($signature);

        return "{$encodedHeader}.{$encodedPayload}.{$encodedSignature}";
    }

    public static function validateToken(?string $token): ?array {
        if (!$token) {
            return null;
        }

        $parts = explode('.', $token);
        if (count($parts) !== 3) {
            return null;
        }

        [$encodedHeader, $encodedPayload, $encodedSignature] = $parts;

        $secret = env('JWT_SECRET', 'al_muheet_default_secret_key_38475892');
        $expectedSignature = self::base64UrlEncode(hash_hmac('sha256', "{$encodedHeader}.{$encodedPayload}", $secret, true));

        if (!hash_equals($expectedSignature, $encodedSignature)) {
            return null; // Signature tampering detected
        }

        $payload = json_decode(self::base64UrlDecode($encodedPayload), true);
        if (!$payload || !isset($payload['exp']) || $payload['exp'] < time()) {
            return null; // Expired or malformed
        }

        return $payload;
    }

    public static function getBearerToken(): ?string {
        $headers = [];
        if (isset($_SERVER['HTTP_AUTHORIZATION'])) {
            $headers = trim($_SERVER['HTTP_AUTHORIZATION']);
        } elseif (isset($_SERVER['REDIRECT_HTTP_AUTHORIZATION'])) {
            $headers = trim($_SERVER['REDIRECT_HTTP_AUTHORIZATION']);
        } elseif (function_exists('apache_request_headers')) {
            $requestHeaders = apache_request_headers();
            if (isset($requestHeaders['Authorization'])) {
                $headers = trim($requestHeaders['Authorization']);
            }
        }

        if (!empty($headers)) {
            if (preg_match('/Bearer\s(\S+)/i', $headers, $matches)) {
                return $matches[1];
            }
        }

        // Also allow passing via header or query param if needed
        return $_GET['token'] ?? null;
    }

    public static function requireAdmin(): array {
        $token = self::getBearerToken();
        if (!$token) {
            Response::error('Authentication required. Missing authorization token.', 401);
        }

        $payload = self::validateToken($token);
        if (!$payload || empty($payload['id'])) {
            Response::error('Invalid or expired authentication session. Please log in again.', 401);
        }

        // Verify admin still exists in database
        $db = Database::getConnection();
        $stmt = $db->prepare("SELECT id, name, email, role FROM admins WHERE id = ?");
        $stmt->execute([$payload['id']]);
        $admin = $stmt->fetch();

        if (!$admin) {
            Response::error('Admin account no longer exists.', 401);
        }

        return $admin;
    }
}
