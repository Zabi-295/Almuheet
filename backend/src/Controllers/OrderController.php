<?php
// ==========================================================
// Al Muheet Fragrance - Order Controller (Cash on Delivery)
// ==========================================================

require_once __DIR__ . '/../Auth.php';
require_once __DIR__ . '/../Response.php';
require_once __DIR__ . '/../../config/database.php';

class OrderController {
    // Public: Place Cash on Delivery Order
    public static function create(): void {
        $input = json_decode(file_get_contents('php://input'), true) ?? [];

        $customerName = trim($input['customer_name'] ?? '');
        $customerPhone = trim($input['customer_phone'] ?? '');
        $customerEmail = trim($input['customer_email'] ?? '');
        $deliveryAddress = trim($input['delivery_address'] ?? '');
        $city = trim($input['city'] ?? '');
        $postalCode = trim($input['postal_code'] ?? '');
        $orderNotes = trim($input['order_notes'] ?? '');
        $items = $input['items'] ?? [];

        if (empty($customerName) || empty($customerPhone) || empty($deliveryAddress) || empty($city)) {
            Response::error('Name, phone number, address, and city are required for delivery.', 422);
        }

        if (empty($items) || !is_array($items)) {
            Response::error('Your fragrance cart is empty.', 422);
        }

        $db = Database::getConnection();

        // Fetch settings for shipping calculations
        $settingsStmt = $db->query("SELECT key_name, value_text FROM settings");
        $settings = $settingsStmt->fetchAll(PDO::FETCH_KEY_PAIR);
        $shippingRate = (float)($settings['shipping_fee'] ?? 250);
        $freeThreshold = (float)($settings['free_shipping_threshold'] ?? 6000);

        // Calculate subtotal & verify items
        $subtotal = 0.0;
        $processedItems = [];

        foreach ($items as $item) {
            $productId = (int)($item['product_id'] ?? 0);
            $qty = max(1, (int)($item['quantity'] ?? 1));

            $prodStmt = $db->prepare("SELECT id, name, price, stock_quantity FROM products WHERE id = ?");
            $prodStmt->execute([$productId]);
            $prod = $prodStmt->fetch();

            if (!$prod) {
                Response::error("Product ID {$productId} no longer exists in our catalog.", 422);
            }

            if ($prod['stock_quantity'] < $qty) {
                Response::error("Insufficient stock for '{$prod['name']}'. Only {$prod['stock_quantity']} available.", 422);
            }

            $lineTotal = (float)$prod['price'] * $qty;
            $subtotal += $lineTotal;

            $processedItems[] = [
                'product_id'   => $prod['id'],
                'product_name' => $prod['name'],
                'price'        => (float)$prod['price'],
                'quantity'     => $qty,
                'subtotal'     => $lineTotal,
                'current_stock'=> (int)$prod['stock_quantity']
            ];
        }

        $shippingFee = ($subtotal >= $freeThreshold) ? 0.00 : $shippingRate;
        $totalAmount = $subtotal + $shippingFee;

        // Generate Order Number: AM-YYYY-RANDOM
        $orderNumber = 'AM-' . date('Y') . '-' . strtoupper(substr(bin2hex(random_bytes(4)), 0, 6));

        // Start Transaction
        $db->beginTransaction();

        try {
            $orderStmt = $db->prepare("
                INSERT INTO orders (
                    order_number, customer_name, customer_phone, customer_email,
                    delivery_address, city, postal_code, order_notes, payment_method,
                    subtotal, shipping_fee, total_amount, order_status, is_sample
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'Cash on Delivery', ?, ?, ?, 'pending', 0)
            ");

            $orderStmt->execute([
                $orderNumber,
                $customerName,
                $customerPhone,
                $customerEmail ?: null,
                $deliveryAddress,
                $city,
                $postalCode ?: null,
                $orderNotes ?: null,
                $subtotal,
                $shippingFee,
                $totalAmount
            ]);

            $orderId = (int)$db->lastInsertId();

            $itemStmt = $db->prepare("
                INSERT INTO order_items (order_id, product_id, product_name, price, quantity, subtotal)
                VALUES (?, ?, ?, ?, ?, ?)
            ");

            $stockUpdateStmt = $db->prepare("UPDATE products SET stock_quantity = stock_quantity - ? WHERE id = ?");
            $invLogStmt = $db->prepare("
                INSERT INTO inventory_logs (product_id, change_amount, new_stock, type, notes)
                VALUES (?, ?, ?, 'order_sale', ?)
            ");

            foreach ($processedItems as $it) {
                $itemStmt->execute([
                    $orderId,
                    $it['product_id'],
                    $it['product_name'],
                    $it['price'],
                    $it['quantity'],
                    $it['subtotal']
                ]);

                // Deduct stock
                $stockUpdateStmt->execute([$it['quantity'], $it['product_id']]);
                $newStock = $it['current_stock'] - $it['quantity'];

                // Log inventory change
                $invLogStmt->execute([
                    $it['product_id'],
                    -$it['quantity'],
                    $newStock,
                    "Order #{$orderNumber} (Cash on Delivery)"
                ]);
            }

            $db->commit();

            Response::success([
                'order_id'       => $orderId,
                'order_number'   => $orderNumber,
                'subtotal'       => $subtotal,
                'shipping_fee'   => $shippingFee,
                'total_amount'   => $totalAmount,
                'currency'       => 'PKR',
                'payment_method' => 'Cash on Delivery',
                'customer_name'  => $customerName,
                'delivery_city'  => $city,
                'order_status'   => 'pending'
            ], 'Your order has been placed successfully. Payment will be collected in cash upon delivery.', 201);

        } catch (Exception $e) {
            $db->rollBack();
            Response::error('Failed to create order: ' . $e->getMessage(), 500);
        }
    }

    // Public: Track Order by Order Number & Phone
    public static function track(): void {
        $orderNumber = trim($_GET['order_number'] ?? '');
        $phone = trim($_GET['phone'] ?? '');

        if (empty($orderNumber)) {
            Response::error('Order number is required.', 422);
        }

        $db = Database::getConnection();
        $query = "SELECT * FROM orders WHERE order_number = ?";
        $params = [$orderNumber];

        if (!empty($phone)) {
            // Normalize phone check (strip non-digits)
            $query .= " AND (customer_phone LIKE ?)";
            $params[] = '%' . preg_replace('/[^0-9]/', '', $phone) . '%';
        }

        $stmt = $db->prepare($query);
        $stmt->execute($params);
        $order = $stmt->fetch();

        if (!$order) {
            Response::error('No order found with the provided details.', 404);
        }

        // Get items
        $itemsStmt = $db->prepare("SELECT product_name, price, quantity, subtotal FROM order_items WHERE order_id = ?");
        $itemsStmt->execute([$order['id']]);
        $order['items'] = $itemsStmt->fetchAll();

        Response::success($order, 'Order status found');
    }

    // Admin: List all orders
    public static function getAll(): void {
        Auth::requireAdmin();
        $db = Database::getConnection();

        $query = "
            SELECT o.*, COUNT(oi.id) AS total_items
            FROM orders o
            LEFT JOIN order_items oi ON oi.order_id = o.id
            WHERE 1=1
        ";
        $params = [];

        if (!empty($_GET['status'])) {
            $query .= " AND o.order_status = ?";
            $params[] = trim($_GET['status']);
        }

        if (!empty($_GET['city'])) {
            $query .= " AND o.city LIKE ?";
            $params[] = '%' . trim($_GET['city']) . '%';
        }

        if (!empty($_GET['search'])) {
            $search = '%' . trim($_GET['search']) . '%';
            $query .= " AND (o.order_number LIKE ? OR o.customer_name LIKE ? OR o.customer_phone LIKE ?)";
            $params[] = $search;
            $params[] = $search;
            $params[] = $search;
        }

        $query .= " GROUP BY o.id ORDER BY o.id DESC";

        $stmt = $db->prepare($query);
        $stmt->execute($params);
        $orders = $stmt->fetchAll();

        foreach ($orders as &$o) {
            $o['subtotal'] = (float)$o['subtotal'];
            $o['shipping_fee'] = (float)$o['shipping_fee'];
            $o['total_amount'] = (float)$o['total_amount'];
            $o['total_items'] = (int)$o['total_items'];
            $o['is_sample'] = (bool)$o['is_sample'];
            $o['payment_status'] = !empty($o['payment_status']) ? $o['payment_status'] : 'pending';
            $o['courier_name'] = !empty($o['courier_name']) ? $o['courier_name'] : 'Trax Logistics';
            $o['tracking_number'] = !empty($o['tracking_number']) ? $o['tracking_number'] : '';
        }

        Response::success($orders, 'Orders retrieved');
    }

    // Admin: Get single order with complete items
    public static function getOne($id): void {
        Auth::requireAdmin();
        $db = Database::getConnection();

        $stmt = $db->prepare("SELECT * FROM orders WHERE id = ?");
        $stmt->execute([(int)$id]);
        $order = $stmt->fetch();

        if (!$order) {
            Response::error('Order not found.', 404);
        }

        $itemsStmt = $db->prepare("
            SELECT oi.*, p.image_url, p.sku
            FROM order_items oi
            LEFT JOIN products p ON oi.product_id = p.id
            WHERE oi.order_id = ?
        ");
        $itemsStmt->execute([(int)$id]);
        $order['items'] = $itemsStmt->fetchAll();

        $order['subtotal'] = (float)$order['subtotal'];
        $order['shipping_fee'] = (float)$order['shipping_fee'];
        $order['total_amount'] = (float)$order['total_amount'];
        $order['payment_status'] = !empty($order['payment_status']) ? $order['payment_status'] : 'pending';
        $order['courier_name'] = !empty($order['courier_name']) ? $order['courier_name'] : 'Trax Logistics';
        $order['tracking_number'] = !empty($order['tracking_number']) ? $order['tracking_number'] : '';
        $order['admin_notes'] = !empty($order['admin_notes']) ? $order['admin_notes'] : '';

        Response::success($order, 'Order details');
    }

    // Admin: Full update of order (Shopify style order management)
    public static function update($id): void {
        Auth::requireAdmin();
        $input = json_decode(file_get_contents('php://input'), true) ?? [];
        $db = Database::getConnection();

        $stmt = $db->prepare("SELECT * FROM orders WHERE id = ?");
        $stmt->execute([(int)$id]);
        $existing = $stmt->fetch();

        if (!$existing) {
            Response::error('Order not found.', 404);
        }

        $customerName = trim($input['customer_name'] ?? $existing['customer_name']);
        $customerPhone = trim($input['customer_phone'] ?? $existing['customer_phone']);
        $customerEmail = isset($input['customer_email']) ? trim($input['customer_email']) : $existing['customer_email'];
        $deliveryAddress = trim($input['delivery_address'] ?? $existing['delivery_address']);
        $city = trim($input['city'] ?? $existing['city']);
        $postalCode = isset($input['postal_code']) ? trim($input['postal_code']) : ($existing['postal_code'] ?? null);
        $orderNotes = isset($input['order_notes']) ? trim($input['order_notes']) : ($existing['order_notes'] ?? null);
        $orderStatus = strtolower(trim($input['order_status'] ?? $existing['order_status']));
        $paymentStatus = strtolower(trim($input['payment_status'] ?? ($existing['payment_status'] ?? 'pending')));
        $courierName = isset($input['courier_name']) ? trim($input['courier_name']) : ($existing['courier_name'] ?? null);
        $trackingNumber = isset($input['tracking_number']) ? trim($input['tracking_number']) : ($existing['tracking_number'] ?? null);
        $adminNotes = isset($input['admin_notes']) ? trim($input['admin_notes']) : ($existing['admin_notes'] ?? null);

        $validStatuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];
        if (!in_array($orderStatus, $validStatuses)) {
            Response::error('Invalid order status.', 422);
        }

        $updateStmt = $db->prepare("
            UPDATE orders SET
                customer_name = ?, customer_phone = ?, customer_email = ?,
                delivery_address = ?, city = ?, postal_code = ?,
                order_notes = ?, order_status = ?, payment_status = ?,
                courier_name = ?, tracking_number = ?, admin_notes = ?
            WHERE id = ?
        ");

        $updateStmt->execute([
            $customerName, $customerPhone, $customerEmail ?: null,
            $deliveryAddress, $city, $postalCode ?: null,
            $orderNotes ?: null, $orderStatus, $paymentStatus,
            $courierName ?: null, $trackingNumber ?: null, $adminNotes ?: null,
            (int)$id
        ]);

        Response::success(['id' => (int)$id, 'order_status' => $orderStatus], 'Order updated successfully');
    }

    // Admin: Update order status
    public static function updateStatus($id): void {
        Auth::requireAdmin();
        $input = json_decode(file_get_contents('php://input'), true) ?? [];
        $status = strtolower(trim($input['status'] ?? ''));

        $validStatuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];
        if (!in_array($status, $validStatuses)) {
            Response::error('Invalid order status.', 422);
        }

        $db = Database::getConnection();
        $stmt = $db->prepare("UPDATE orders SET order_status = ? WHERE id = ?");
        $stmt->execute([$status, (int)$id]);

        Response::success(['id' => (int)$id, 'order_status' => $status], "Order status updated to {$status}");
    }

    // Admin: Delete single order
    public static function delete($id): void {
        Auth::requireAdmin();
        $db = Database::getConnection();

        $stmt = $db->prepare("DELETE FROM orders WHERE id = ?");
        $stmt->execute([(int)$id]);

        Response::success(['id' => (int)$id], 'Order deleted successfully');
    }

    // Admin: Wipe all sample / test orders
    public static function clearSampleOrders(): void {
        Auth::requireAdmin();
        $db = Database::getConnection();

        $stmt = $db->prepare("DELETE FROM order_items WHERE order_id IN (SELECT id FROM orders WHERE is_sample = 1)");
        $stmt->execute();

        $stmt2 = $db->prepare("DELETE FROM orders WHERE is_sample = 1");
        $stmt2->execute();
        $deleted = $stmt2->rowCount();

        Response::success(['deleted_count' => $deleted], "Deleted {$deleted} sample orders.");
    }
}

