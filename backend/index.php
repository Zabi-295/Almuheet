<?php
// ==========================================================
// Al Muheet Fragrance - Backend Entry Point
// ==========================================================

require_once __DIR__ . '/config/config.php';
require_once __DIR__ . '/config/database.php';
require_once __DIR__ . '/src/Router.php';

// Enable error reporting in development, but suppress raw HTML errors
ini_set('display_errors', '0');
error_reporting(E_ALL);

// Handle CORS
handleCors();

// Serve static uploaded files if requested directly through PHP dev server
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
if (preg_match('#^/uploads/(.+)$#', $uri, $matches)) {
    $filePath = __DIR__ . '/uploads/' . basename($matches[1]);
    if (file_exists($filePath)) {
        $finfo = finfo_open(FILEINFO_MIME_TYPE);
        $mime = finfo_file($finfo, $filePath);
        finfo_close($finfo);
        header("Content-Type: {$mime}");
        header("Content-Length: " . filesize($filePath));
        readfile($filePath);
        exit;
    }
}

// Global Exception Handler
set_exception_handler(function (Throwable $e) {
    http_response_code(500);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode([
        'status'  => 'error',
        'message' => 'Internal server error: ' . $e->getMessage()
    ]);
    exit;
});

// Run Router
Router::handle();
