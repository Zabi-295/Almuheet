<?php
// ==========================================================
// Al Muheet Fragrance - Real Database-Driven Analytics Controller
// ==========================================================

require_once __DIR__ . '/../Auth.php';
require_once __DIR__ . '/../Response.php';
require_once __DIR__ . '/../../config/database.php';

class AnalyticsController {
    public static function getStats(): void {
        Auth::requireAdmin();
        $db = Database::getConnection();

        // 1. Core Financial & Order Metrics
        $totalsStmt = $db->query("
            SELECT 
                COUNT(*) AS total_orders,
                COALESCE(SUM(CASE WHEN order_status != 'cancelled' THEN total_amount ELSE 0 END), 0) AS total_revenue,
                COALESCE(AVG(CASE WHEN order_status != 'cancelled' THEN total_amount ELSE NULL END), 0) AS avg_order_value,
                COALESCE(SUM(CASE WHEN order_status = 'pending' THEN 1 ELSE 0 END), 0) AS pending_orders,
                COALESCE(SUM(CASE WHEN order_status = 'delivered' THEN 1 ELSE 0 END), 0) AS delivered_orders,
                COALESCE(SUM(CASE WHEN order_status = 'shipped' THEN 1 ELSE 0 END), 0) AS shipped_orders
            FROM orders
        ");
        $totals = $totalsStmt->fetch();

        // 2. Customers Count (Unique phone numbers)
        $custStmt = $db->query("SELECT COUNT(DISTINCT customer_phone) AS total_customers FROM orders");
        $custCount = (int)$custStmt->fetch()['total_customers'];

        // 3. Low stock count
        $stockStmt = $db->query("SELECT COUNT(*) AS low_stock_count FROM products WHERE stock_quantity <= 10");
        $lowStockCount = (int)$stockStmt->fetch()['low_stock_count'];

        // 4. Top Selling Fragrances
        $topStmt = $db->query("
            SELECT oi.product_id, oi.product_name, SUM(oi.quantity) AS total_units_sold, SUM(oi.subtotal) AS total_sales, p.image_url
            FROM order_items oi
            LEFT JOIN products p ON oi.product_id = p.id
            JOIN orders o ON oi.order_id = o.id
            WHERE o.order_status != 'cancelled'
            GROUP BY oi.product_name
            ORDER BY total_units_sold DESC
            LIMIT 5
        ");
        $topSelling = $topStmt->fetchAll();
        foreach ($topSelling as &$item) {
            $item['total_units_sold'] = (int)$item['total_units_sold'];
            $item['total_sales'] = (float)$item['total_sales'];
        }

        // 5. Orders by Status Breakdown
        $statusStmt = $db->query("
            SELECT order_status, COUNT(*) AS count
            FROM orders
            GROUP BY order_status
        ");
        $statusBreakdown = $statusStmt->fetchAll();

        // 6. Orders by Pakistani City
        $cityStmt = $db->query("
            SELECT city, COUNT(*) as orders_count, SUM(total_amount) as total_volume
            FROM orders
            GROUP BY city
            ORDER BY orders_count DESC
            LIMIT 8
        ");
        $cityBreakdown = $cityStmt->fetchAll();
        foreach ($cityBreakdown as &$city) {
            $city['orders_count'] = (int)$city['orders_count'];
            $city['total_volume'] = (float)$city['total_volume'];
        }

        // 7. Recent 7-Day Sales Trend
        $isSqlite = Database::getDriverUsed() === 'sqlite';
        $dateFunc = $isSqlite ? "strftime('%Y-%m-%d', created_at)" : "DATE(created_at)";

        $salesStmt = $db->query("
            SELECT {$dateFunc} AS order_date, COUNT(*) AS order_count, SUM(total_amount) AS daily_revenue
            FROM orders
            WHERE order_status != 'cancelled'
            GROUP BY {$dateFunc}
            ORDER BY order_date DESC
            LIMIT 14
        ");
        $salesTrend = array_reverse($salesStmt->fetchAll());
        foreach ($salesTrend as &$trend) {
            $trend['order_count'] = (int)$trend['order_count'];
            $trend['daily_revenue'] = (float)$trend['daily_revenue'];
        }

        Response::success([
            'summary' => [
                'total_revenue'    => (float)$totals['total_revenue'],
                'total_orders'     => (int)$totals['total_orders'],
                'avg_order_value'  => round((float)$totals['avg_order_value'], 2),
                'pending_orders'   => (int)$totals['pending_orders'],
                'shipped_orders'   => (int)$totals['shipped_orders'],
                'delivered_orders' => (int)$totals['delivered_orders'],
                'total_customers'  => $custCount,
                'low_stock_count'  => $lowStockCount,
                'currency'         => 'PKR'
            ],
            'top_selling'      => $topSelling,
            'status_breakdown' => $statusBreakdown,
            'city_breakdown'   => $cityBreakdown,
            'sales_trend'      => $salesTrend
        ], 'Real-time database analytics retrieved');
    }
}
