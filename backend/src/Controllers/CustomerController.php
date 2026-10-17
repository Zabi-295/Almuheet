<?php
// ==========================================================
// Al Muheet Fragrance - Customer Management Controller
// ==========================================================

require_once __DIR__ . '/../Auth.php';
require_once __DIR__ . '/../Response.php';
require_once __DIR__ . '/../../config/database.php';

class CustomerController {
    public static function getAll(): void {
        Auth::requireAdmin();
        $db = Database::getConnection();

        $query = "
            SELECT 
                customer_phone,
                customer_name,
                customer_email,
                city,
                delivery_address,
                COUNT(id) AS total_orders,
                SUM(total_amount) AS total_spent,
                MAX(created_at) AS last_order_date
            FROM orders
            WHERE 1=1
        ";
        $params = [];

        if (!empty($_GET['search'])) {
            $search = '%' . trim($_GET['search']) . '%';
            $query .= " AND (customer_name LIKE ? OR customer_phone LIKE ? OR city LIKE ?)";
            $params[] = $search;
            $params[] = $search;
            $params[] = $search;
        }

        $query .= " GROUP BY customer_phone ORDER BY last_order_date DESC";

        $stmt = $db->prepare($query);
        $stmt->execute($params);
        $customers = $stmt->fetchAll();

        foreach ($customers as &$c) {
            $c['total_orders'] = (int)$c['total_orders'];
            $c['total_spent'] = (float)$c['total_spent'];
        }

        Response::success($customers, 'Customer list retrieved');
    }
}
