<?php
// ==========================================================
// Al Muheet Fragrance - Category Controller
// ==========================================================

require_once __DIR__ . '/../Auth.php';
require_once __DIR__ . '/../Response.php';
require_once __DIR__ . '/../../config/database.php';

class CategoryController {
    public static function getAll(): void {
        $db = Database::getConnection();

        $query = "
            SELECT c.*, COUNT(p.id) AS products_count
            FROM categories c
            LEFT JOIN products p ON p.category_id = c.id
            GROUP BY c.id
            ORDER BY c.is_featured DESC, c.name ASC
        ";
        $stmt = $db->query($query);
        $categories = $stmt->fetchAll();

        foreach ($categories as &$c) {
            $c['products_count'] = (int)$c['products_count'];
            $c['is_featured'] = (bool)$c['is_featured'];
        }

        Response::success($categories, 'Categories retrieved');
    }

    public static function create(): void {
        Auth::requireAdmin();
        $input = json_decode(file_get_contents('php://input'), true) ?? [];

        $name = trim($input['name'] ?? '');
        if (empty($name)) {
            Response::error('Category name is required.', 422);
        }

        $slug = trim($input['slug'] ?? '');
        if (empty($slug)) {
            $slug = strtolower(trim(preg_replace('/[^A-Za-z0-9-]+/', '-', $name), '-'));
        }

        $db = Database::getConnection();
        $stmt = $db->prepare("INSERT INTO categories (name, slug, description, image_url, is_featured) VALUES (?, ?, ?, ?, ?)");
        $stmt->execute([
            $name,
            $slug,
            $input['description'] ?? null,
            $input['image_url'] ?? '/images/royal-oud.jpg',
            !empty($input['is_featured']) ? 1 : 0
        ]);

        Response::success(['id' => (int)$db->lastInsertId()], 'Category created', 201);
    }

    public static function update($id): void {
        Auth::requireAdmin();
        $input = json_decode(file_get_contents('php://input'), true) ?? [];

        $name = trim($input['name'] ?? '');
        if (empty($name)) {
            Response::error('Category name is required.', 422);
        }

        $db = Database::getConnection();
        $stmt = $db->prepare("UPDATE categories SET name = ?, slug = ?, description = ?, image_url = ?, is_featured = ? WHERE id = ?");
        $stmt->execute([
            $name,
            $input['slug'] ?? '',
            $input['description'] ?? null,
            $input['image_url'] ?? null,
            !empty($input['is_featured']) ? 1 : 0,
            (int)$id
        ]);

        Response::success(['id' => (int)$id], 'Category updated');
    }

    public static function delete($id): void {
        Auth::requireAdmin();
        $db = Database::getConnection();

        $stmt = $db->prepare("DELETE FROM categories WHERE id = ?");
        $stmt->execute([(int)$id]);

        Response::success(null, 'Category deleted');
    }
}
