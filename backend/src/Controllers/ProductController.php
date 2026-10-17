<?php
// ==========================================================
// Al Muheet Fragrance - Product Controller
// ==========================================================

require_once __DIR__ . '/../Auth.php';
require_once __DIR__ . '/../Response.php';
require_once __DIR__ . '/../../config/database.php';

class ProductController {
    public static function getAll(): void {
        $db = Database::getConnection();

        $query = "
            SELECT p.*, c.name AS category_name, c.slug AS category_slug
            FROM products p
            LEFT JOIN categories c ON p.category_id = c.id
            WHERE 1=1
        ";
        $params = [];

        // Filter by category
        if (!empty($_GET['category'])) {
            $cat = trim($_GET['category']);
            if (is_numeric($cat)) {
                $query .= " AND p.category_id = ?";
                $params[] = (int)$cat;
            } else {
                $query .= " AND c.slug = ?";
                $params[] = $cat;
            }
        }

        // Filter by search query
        if (!empty($_GET['search'])) {
            $search = '%' . trim($_GET['search']) . '%';
            $query .= " AND (p.name LIKE ? OR p.short_description LIKE ? OR p.top_notes LIKE ? OR p.heart_notes LIKE ? OR p.base_notes LIKE ?)";
            $params[] = $search;
            $params[] = $search;
            $params[] = $search;
            $params[] = $search;
            $params[] = $search;
        }

        // Filter by gender
        if (!empty($_GET['gender'])) {
            $gender = trim($_GET['gender']);
            $query .= " AND p.gender LIKE ?";
            $params[] = '%' . $gender . '%';
        }

        // Filter by price range
        if (isset($_GET['min_price']) && is_numeric($_GET['min_price'])) {
            $query .= " AND p.price >= ?";
            $params[] = (float)$_GET['min_price'];
        }
        if (isset($_GET['max_price']) && is_numeric($_GET['max_price'])) {
            $query .= " AND p.price <= ?";
            $params[] = (float)$_GET['max_price'];
        }

        // Filter by featured
        if (isset($_GET['featured']) && $_GET['featured'] == '1') {
            $query .= " AND p.is_featured = 1";
        }

        // Sorting
        $sort = $_GET['sort'] ?? 'featured';
        switch ($sort) {
            case 'price_asc':
                $query .= " ORDER BY p.price ASC";
                break;
            case 'price_desc':
                $query .= " ORDER BY p.price DESC";
                break;
            case 'newest':
                $query .= " ORDER BY p.id DESC";
                break;
            case 'stock_asc':
                $query .= " ORDER BY p.stock_quantity ASC";
                break;
            case 'featured':
            default:
                $query .= " ORDER BY p.is_featured DESC, p.id DESC";
                break;
        }

        $stmt = $db->prepare($query);
        $stmt->execute($params);
        $products = $stmt->fetchAll();

        // Decode JSON gallery for each product
        foreach ($products as &$p) {
            $p['gallery'] = !empty($p['gallery']) ? json_decode($p['gallery'], true) : [];
            $p['price'] = (float)$p['price'];
            $p['compare_at_price'] = $p['compare_at_price'] ? (float)$p['compare_at_price'] : null;
            $p['stock_quantity'] = (int)$p['stock_quantity'];
            $p['is_featured'] = (bool)$p['is_featured'];
            $p['is_sample'] = (bool)$p['is_sample'];
        }

        Response::success($products, 'Products retrieved successfully');
    }

    public static function getOne($idOrSlug): void {
        $db = Database::getConnection();

        if (is_numeric($idOrSlug)) {
            $stmt = $db->prepare("
                SELECT p.*, c.name AS category_name, c.slug AS category_slug
                FROM products p
                LEFT JOIN categories c ON p.category_id = c.id
                WHERE p.id = ?
                LIMIT 1
            ");
            $stmt->execute([(int)$idOrSlug]);
        } else {
            $stmt = $db->prepare("
                SELECT p.*, c.name AS category_name, c.slug AS category_slug
                FROM products p
                LEFT JOIN categories c ON p.category_id = c.id
                WHERE p.slug = ?
                LIMIT 1
            ");
            $stmt->execute([$idOrSlug]);
        }

        $product = $stmt->fetch();
        if (!$product) {
            Response::error('Fragrance not found', 404);
        }

        $product['gallery'] = !empty($product['gallery']) ? json_decode($product['gallery'], true) : [];
        $product['price'] = (float)$product['price'];
        $product['compare_at_price'] = $product['compare_at_price'] ? (float)$product['compare_at_price'] : null;
        $product['stock_quantity'] = (int)$product['stock_quantity'];
        $product['is_featured'] = (bool)$product['is_featured'];
        $product['is_sample'] = (bool)$product['is_sample'];

        Response::success($product, 'Product details');
    }

    public static function create(): void {
        Auth::requireAdmin();
        $input = json_decode(file_get_contents('php://input'), true) ?? [];

        $name = trim($input['name'] ?? '');
        $price = (float)($input['price'] ?? 0);
        $stock = (int)($input['stock_quantity'] ?? 0);
        $sku = trim($input['sku'] ?? '');
        $imageUrl = trim($input['image_url'] ?? '/images/royal-oud.jpg');

        if (empty($name) || $price <= 0 || empty($sku)) {
            Response::error('Product name, valid price, and SKU are required.', 422);
        }

        $slug = trim($input['slug'] ?? '');
        if (empty($slug)) {
            $slug = strtolower(trim(preg_replace('/[^A-Za-z0-9-]+/', '-', $name), '-'));
        }

        $db = Database::getConnection();

        // Check SKU uniqueness
        $stmtCheck = $db->prepare("SELECT id FROM products WHERE sku = ? OR slug = ?");
        $stmtCheck->execute([$sku, $slug]);
        if ($stmtCheck->fetch()) {
            // Append random suffix if slug/sku collision
            $slug .= '-' . rand(10, 99);
        }

        $gallery = isset($input['gallery']) && is_array($input['gallery']) ? json_encode($input['gallery']) : '[]';

        $stmt = $db->prepare("
            INSERT INTO products (
                name, slug, category_id, short_description, description, price, compare_at_price,
                stock_quantity, sku, image_url, gallery, volume, concentration, gender,
                top_notes, heart_notes, base_notes, longevity, sillage, is_featured, is_sample
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0)
        ");

        $stmt->execute([
            $name,
            $slug,
            !empty($input['category_id']) ? (int)$input['category_id'] : null,
            $input['short_description'] ?? null,
            $input['description'] ?? null,
            $price,
            !empty($input['compare_at_price']) ? (float)$input['compare_at_price'] : null,
            $stock,
            $sku,
            $imageUrl,
            $gallery,
            $input['volume'] ?? '100ml',
            $input['concentration'] ?? 'Extrait de Parfum',
            $input['gender'] ?? 'Unisex',
            $input['top_notes'] ?? null,
            $input['heart_notes'] ?? null,
            $input['base_notes'] ?? null,
            $input['longevity'] ?? '12+ Hours',
            $input['sillage'] ?? 'Strong / Enveloping',
            !empty($input['is_featured']) ? 1 : 0
        ]);

        $newId = (int)$db->lastInsertId();

        // Log initial stock
        if ($stock > 0) {
            $logStmt = $db->prepare("INSERT INTO inventory_logs (product_id, change_amount, new_stock, type, notes) VALUES (?, ?, ?, 'initial_creation', 'Initial stock assignment')");
            $logStmt->execute([$newId, $stock, $stock]);
        }

        Response::success(['id' => $newId, 'slug' => $slug], 'Product created successfully', 201);
    }

    public static function update($id): void {
        Auth::requireAdmin();
        $input = json_decode(file_get_contents('php://input'), true) ?? [];

        $db = Database::getConnection();
        $stmt = $db->prepare("SELECT * FROM products WHERE id = ?");
        $stmt->execute([(int)$id]);
        $existing = $stmt->fetch();

        if (!$existing) {
            Response::error('Product not found.', 404);
        }

        $name = trim($input['name'] ?? $existing['name']);
        $slug = trim($input['slug'] ?? $existing['slug']);
        $price = isset($input['price']) ? (float)$input['price'] : (float)$existing['price'];
        $newStock = isset($input['stock_quantity']) ? (int)$input['stock_quantity'] : (int)$existing['stock_quantity'];
        $sku = trim($input['sku'] ?? $existing['sku']);
        $gallery = isset($input['gallery']) && is_array($input['gallery']) ? json_encode($input['gallery']) : $existing['gallery'];

        $updateStmt = $db->prepare("
            UPDATE products SET
                name = ?, slug = ?, category_id = ?, short_description = ?, description = ?,
                price = ?, compare_at_price = ?, stock_quantity = ?, sku = ?, image_url = ?,
                gallery = ?, volume = ?, concentration = ?, gender = ?, top_notes = ?,
                heart_notes = ?, base_notes = ?, longevity = ?, sillage = ?, is_featured = ?
            WHERE id = ?
        ");

        $updateStmt->execute([
            $name,
            $slug,
            !empty($input['category_id']) ? (int)$input['category_id'] : null,
            $input['short_description'] ?? $existing['short_description'],
            $input['description'] ?? $existing['description'],
            $price,
            isset($input['compare_at_price']) ? ($input['compare_at_price'] ? (float)$input['compare_at_price'] : null) : $existing['compare_at_price'],
            $newStock,
            $sku,
            $input['image_url'] ?? $existing['image_url'],
            $gallery,
            $input['volume'] ?? $existing['volume'],
            $input['concentration'] ?? $existing['concentration'],
            $input['gender'] ?? $existing['gender'],
            $input['top_notes'] ?? $existing['top_notes'],
            $input['heart_notes'] ?? $existing['heart_notes'],
            $input['base_notes'] ?? $existing['base_notes'],
            $input['longevity'] ?? $existing['longevity'],
            $input['sillage'] ?? $existing['sillage'],
            isset($input['is_featured']) ? ($input['is_featured'] ? 1 : 0) : $existing['is_featured'],
            (int)$id
        ]);

        // Stock change tracking
        $oldStock = (int)$existing['stock_quantity'];
        if ($oldStock !== $newStock) {
            $diff = $newStock - $oldStock;
            $logStmt = $db->prepare("INSERT INTO inventory_logs (product_id, change_amount, new_stock, type, notes) VALUES (?, ?, ?, 'manual_adjustment', 'Updated via Admin Product Editor')");
            $logStmt->execute([(int)$id, $diff, $newStock]);
        }

        Response::success(['id' => (int)$id], 'Product updated successfully');
    }

    public static function delete($id): void {
        Auth::requireAdmin();
        $db = Database::getConnection();

        $stmt = $db->prepare("DELETE FROM products WHERE id = ?");
        $stmt->execute([(int)$id]);

        Response::success(null, 'Product deleted successfully');
    }

    public static function clearSampleProducts(): void {
        Auth::requireAdmin();
        $db = Database::getConnection();

        $stmt = $db->prepare("DELETE FROM products WHERE is_sample = 1");
        $stmt->execute();
        $deletedCount = $stmt->rowCount();

        Response::success(['deleted_count' => $deletedCount], "Cleared {$deletedCount} sample products.");
    }
}
