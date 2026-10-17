# Al Muheet Fragrance — REST API Documentation
**Base URL (Local)**: `http://localhost:8000/api`  
**Base URL (Production)**: `https://almuheet.store/api`

---

## 1. Authentication & Security

All admin endpoints require an HTTP `Authorization` header containing the JWT token issued upon login:

```http
Authorization: Bearer <jwt_token>
```

Tokens are valid for 7 days and signed with HMAC-SHA256.

---

## 2. API Endpoints

### 2.1 Authentication
- **`POST /auth/login`**: Authenticate administrator credentials.
  - Body: `{"email": "admin@almuheet.store", "password": "..."}`
  - Returns: `{ "status": "success", "data": { "token": "...", "admin": {...} } }`
- **`GET /auth/me`**: Verify token and retrieve current admin profile (Requires Bearer Token).
- **`POST /auth/logout`**: Invalidate session.

### 2.2 Store Settings
- **`GET /settings`**: Public store configuration (store name, currency, announcement banner, contact info, free shipping threshold).
- **`PUT /settings`**: Update store settings (Requires Bearer Token).
  - Body: `{"store_name": "Al Muheet Fragrance", "shipping_fee": "250", ...}`

### 2.3 Fragrance Categories
- **`GET /categories`**: List all categories with product counts.
- **`POST /categories`**: Create category (Requires Bearer Token).
- **`PUT /categories/:id`**: Update category (Requires Bearer Token).
- **`DELETE /categories/:id`**: Delete category (Requires Bearer Token).

### 2.4 Products & Fragrances
- **`GET /products`**: Catalog list with optional query parameters:
  - `?category=<slug>`
  - `?search=<term>`
  - `?gender=<Unisex|Pour Homme|Pour Femme>`
  - `?sort=<featured|price_asc|price_desc|newest>`
- **`GET /products/:idOrSlug`**: Retrieve single product with full fragrance pyramid and gallery.
- **`POST /products`**: Create product (Requires Bearer Token).
- **`PUT /products/:id`**: Update product (Requires Bearer Token).
- **`DELETE /products/:id`**: Delete product (Requires Bearer Token).
- **`POST /products/clear-samples`**: Delete all sample products marked with `is_sample = 1` (Requires Bearer Token).

### 2.5 Orders (Cash on Delivery)
- **`POST /orders`**: Place Cash on Delivery order.
  - Body:
    ```json
    {
      "customer_name": "Hamza Tariq",
      "customer_phone": "0300-1234567",
      "customer_email": "hamza@example.com",
      "delivery_address": "House 12, Street 4, Sector F-7/2",
      "city": "Islamabad",
      "order_notes": "Call upon arrival",
      "items": [
        { "product_id": 1, "quantity": 1 }
      ]
    }
    ```
  - Calculates subtotal, applies free delivery threshold, decrements inventory stock, and returns order number `AM-YYYY-XXXX`.
- **`GET /orders/track`**: Public tracking lookup by `?order_number=...&phone=...`.
- **`GET /orders`**: List orders with filter `?status=...&search=...` (Requires Bearer Token).
- **`GET /orders/:id`**: Retrieve full order details and line items (Requires Bearer Token).
- **`PUT /orders/:id/status`**: Update status (`pending`, `confirmed`, `processing`, `shipped`, `delivered`, `cancelled`) (Requires Bearer Token).

### 2.6 Inventory & Stock Auditing
- **`GET /inventory`**: List stock counts with low stock alert flags (Requires Bearer Token).
- **`POST /inventory/adjust`**: Adjust stock with audit reason (Requires Bearer Token).
  - Body: `{"product_id": 1, "change_amount": 10, "type": "manual_restock", "notes": "New batch inward"}`
- **`GET /inventory/logs`**: List last 50 inventory change events (Requires Bearer Token).

### 2.7 Database Analytics
- **`GET /analytics`**: Returns aggregated metrics (gross revenue, AOV, orders count, top-selling fragrances, sales trend by date, city distribution) (Requires Bearer Token).

### 2.8 Customers
- **`GET /customers`**: Customer directory derived from orders with total lifetime spend (Requires Bearer Token).

### 2.9 Media Uploads
- **`POST /upload`**: Upload product image file (multipart/form-data) (Requires Bearer Token).
