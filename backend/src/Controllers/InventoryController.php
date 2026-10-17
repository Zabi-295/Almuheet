<?php
// ==========================================================
// Al Muheet Fragrance - Inventory Controller
// ==========================================================

require_once __DIR__ . '/../Auth.php';
require_once __DIR__ . '/../Response.php';
require_once __DIR__ . '/../../config/database.php';

class InventoryController {
    public static function getAll(): void {
        Auth::requireAdmin();
        $db = Database::getConnection();

        $threshold = (int)($_GET['threshold'] ?? 10);

        $stmt = $db->query("
            SELECT p.id, p.name, p.sku, p.stock_quantity, p.price, p.image_url, c.name AS category_name,
                   CASE WHEN p.stock_quantity <= {$threshold} THEN 1 ELSE 0 END AS is_low_stock
            FROM products p
            LEFT JOIN categories c ON p.category_id = c.id
            ORDER BY p.stock_quantity ASC, p.name ASC
        ");
        $inventory = $stmt->fetchAll();

        foreach ($inventory as &$item) {
            $item['stock_quantity'] = (int)$item['stock_quantity'];
            $item['price'] = (float)$item['price'];
            $item['is_low_stock'] = (bool)$item['is_low_stock'];
        }

        Response::success($inventory, 'Inventory retrieved');
    }

    public static function adjust(): void {
        Auth::requireAdmin();
        $input = json_decode(file_get_contents('php://input'), true) ?? [];

        $productId = (int)($input['product_id'] ?? 0);
        $changeAmount = (int)($input['change_amount'] ?? 0);
        $type = trim($input['type'] ?? 'manual_restock');
        $notes = trim($input['notes'] ?? 'Stock adjustment via Admin Inventory');

        if ($productId <= 0 || $changeAmount === 0) {
            Response::error('Product ID and valid non-zero change amount required.', 422);
        }

        $db = Database::getConnection();
        $stmt = $db->prepare("SELECT id, name, stock_quantity FROM products WHERE id = ?");
        $stmt->execute([$productId]);
        $prod = $stmt->fetch();

        if (!$prod) {
            Response::error('Product not found.', 404);
        }

        $newStock = max(0, (int)$prod['stock_quantity'] + $changeAmount);

        $db->beginTransaction();
        try {
            $updateStmt = $db->prepare("UPDATE products SET stock_quantity = ? WHERE id = ?");
            $updateStmt->execute([$newStock, $productId]);

            $logStmt = $db->prepare("
                INSERT INTO inventory_logs (product_id, change_amount, new_stock, type, notes)
                VALUES (?, ?, ?, ?, ?)
            ");
            $logStmt->execute([$productId, $changeAmount, $newStock, $type, $notes]);

            $db->commit();

            Response::success([
                'product_id' => $productId,
                'old_stock'  => (int)$prod['stock_quantity'],
                'new_stock'  => $newStock
            ], "Stock for '{$prod['name']}' updated to {$newStock}.");
        } catch (Exception $e) {
            $db->rollBack();
            Response::error('Failed to update inventory: ' . $e->getMessage(), 500);
        }
    }

    public static function getLogs(): void {
        Auth::requireAdmin();
        $db = Database::getConnection();

        $productId = isset($_GET['product_id']) ? (int)$_GET['product_id'] : null;
        $query = "
            SELECT l.*, p.name AS product_name, p.sku
            FROM inventory_logs l
            JOIN products p ON l.product_id = p.id
        ";
        $params = [];

        if ($productId) {
            $query .= " WHERE l.product_id = ?";
            $params[] = $productId;
        }

        $query .= " ORDER BY l.id DESC LIMIT 50";

        $stmt = $db->prepare($query);
        $stmt->execute($params);
        $logs = $stmt->fetchAll();

        foreach ($logs as &$log) {
            $log['change_amount'] = (int)$log['change_amount'];
            $log['new_stock'] = (int)$log['new_stock'];
        }

        Response::success($logs, 'Inventory history logs retrieved');
    }
}
