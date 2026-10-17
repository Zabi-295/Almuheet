<?php
// ==========================================================
// Al Muheet Fragrance - REST API Router
// ==========================================================

require_once __DIR__ . '/Response.php';
require_once __DIR__ . '/Auth.php';
require_once __DIR__ . '/Controllers/AuthController.php';
require_once __DIR__ . '/Controllers/ProductController.php';
require_once __DIR__ . '/Controllers/CategoryController.php';
require_once __DIR__ . '/Controllers/OrderController.php';
require_once __DIR__ . '/Controllers/InventoryController.php';
require_once __DIR__ . '/Controllers/AnalyticsController.php';
require_once __DIR__ . '/Controllers/CustomerController.php';
require_once __DIR__ . '/Controllers/SettingsController.php';

class Router {
    public static function handle(): void {
        $method = $_SERVER['REQUEST_METHOD'];
        $uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

        // Normalize URL: strip trailing slashes and prefix
        // Handle paths whether served at root, /api, or /backend/index.php
        $path = $uri;
        if (strpos($path, '/api') !== false) {
            $path = substr($path, strpos($path, '/api'));
        }
        $path = rtrim($path, '/');
        if (empty($path)) {
            $path = '/api';
        }

        // 1. Health & Root Info
        if ($path === '/api' || $path === '') {
            Response::json([
                'name'    => 'Al Muheet Fragrance REST API',
                'version' => '1.0.0',
                'status'  => 'active',
                'time'    => date('c'),
                'database'=> Database::getDriverUsed()
            ]);
        }

        // 2. Authentication Routes
        if ($path === '/api/auth/login' && $method === 'POST') {
            AuthController::login();
        }
        if ($path === '/api/auth/me' && $method === 'GET') {
            AuthController::me();
        }
        if ($path === '/api/auth/logout' && $method === 'POST') {
            AuthController::logout();
        }

        // 3. Settings Routes
        if ($path === '/api/settings') {
            if ($method === 'GET') SettingsController::getPublic();
            if ($method === 'PUT') SettingsController::update();
        }

        // 4. Categories Routes
        if ($path === '/api/categories') {
            if ($method === 'GET') CategoryController::getAll();
            if ($method === 'POST') CategoryController::create();
        }
        if (preg_match('#^/api/categories/(\d+)$#', $path, $m)) {
            $id = (int)$m[1];
            if ($method === 'PUT') CategoryController::update($id);
            if ($method === 'DELETE') CategoryController::delete($id);
        }

        // 5. Products Routes
        if ($path === '/api/products/clear-samples' && $method === 'POST') {
            ProductController::clearSampleProducts();
        }
        if ($path === '/api/products') {
            if ($method === 'GET') ProductController::getAll();
            if ($method === 'POST') ProductController::create();
        }
        if (preg_match('#^/api/products/([^/]+)$#', $path, $m)) {
            $idOrSlug = $m[1];
            if ($method === 'GET') ProductController::getOne($idOrSlug);
            if ($method === 'PUT') ProductController::update($idOrSlug);
            if ($method === 'DELETE') ProductController::delete($idOrSlug);
        }

        // 6. Inventory Routes (Admin Only)
        if ($path === '/api/inventory' && $method === 'GET') {
            InventoryController::getAll();
        }
        if ($path === '/api/inventory/adjust' && $method === 'POST') {
            InventoryController::adjust();
        }
        if ($path === '/api/inventory/logs' && $method === 'GET') {
            InventoryController::getLogs();
        }

        // 7. Orders Routes
        if ($path === '/api/orders/clear-samples' && $method === 'POST') {
            OrderController::clearSampleOrders();
        }
        if ($path === '/api/orders/track' && $method === 'GET') {
            OrderController::track();
        }
        if ($path === '/api/orders') {
            if ($method === 'GET') OrderController::getAll();
            if ($method === 'POST') OrderController::create();
        }
        if (preg_match('#^/api/orders/(\d+)$#', $path, $m)) {
            $id = (int)$m[1];
            if ($method === 'GET') OrderController::getOne($id);
            if ($method === 'PUT') OrderController::update($id);
            if ($method === 'DELETE') OrderController::delete($id);
        }
        if (preg_match('#^/api/orders/(\d+)/status$#', $path, $m)) {
            $id = (int)$m[1];
            if ($method === 'PUT') OrderController::updateStatus($id);
        }

        // 8. Customers Route (Admin Only)
        if ($path === '/api/customers' && $method === 'GET') {
            CustomerController::getAll();
        }

        // 9. Analytics Route (Admin Only)
        if ($path === '/api/analytics' && $method === 'GET') {
            AnalyticsController::getStats();
        }

        // 10. Image Upload Route (Admin Only)
        if ($path === '/api/upload' && $method === 'POST') {
            self::handleUpload();
        }

        // 404 Route Not Found
        Response::error("API endpoint {$method} {$path} not found.", 404);
    }

    private static function handleUpload(): void {
        Auth::requireAdmin();

        if (empty($_FILES['image'])) {
            Response::error('No image file uploaded.', 422);
        }

        $file = $_FILES['image'];
        if ($file['error'] !== UPLOAD_ERR_OK) {
            Response::error('File upload error code: ' . $file['error'], 400);
        }

        // Validate MIME type
        $allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
        $finfo = finfo_open(FILEINFO_MIME_TYPE);
        $mime = finfo_file($finfo, $file['tmp_name']);
        finfo_close($finfo);

        if (!in_array($mime, $allowedTypes)) {
            Response::error('Invalid image type. Only JPEG, PNG, and WebP are supported.', 422);
        }

        $ext = pathinfo($file['name'], PATHINFO_EXTENSION) ?: 'jpg';
        $filename = 'perfume_' . time() . '_' . bin2hex(random_bytes(4)) . '.' . strtolower($ext);

        $uploadDir = dirname(__DIR__) . '/uploads';
        if (!is_dir($uploadDir)) {
            mkdir($uploadDir, 0755, true);
        }

        $destination = $uploadDir . '/' . $filename;
        if (!move_uploaded_file($file['tmp_name'], $destination)) {
            Response::error('Failed to save uploaded file.', 500);
        }

        // Also sync to frontend/public/uploads if exists for seamless local Vite development
        $frontendUploadDir = dirname(__DIR__, 2) . '/frontend/public/uploads';
        if (is_dir(dirname($frontendUploadDir))) {
            if (!is_dir($frontendUploadDir)) {
                mkdir($frontendUploadDir, 0755, true);
            }
            @copy($destination, $frontendUploadDir . '/' . $filename);
        }

        Response::success([
            'filename'  => $filename,
            'url'       => '/uploads/' . $filename,
            'image_url' => '/uploads/' . $filename
        ], 'Image uploaded successfully', 201);
    }
}
