# GoDaddy Hosting Deployment Blueprint — Al Muheet Fragrance
**Target Production Domain**: `almuheet.store`  
**Architecture**: React SPA + PHP REST API + MySQL Database (HTTPS)

---

## 1. Pre-Deployment Hosting Plan Requirements

Before purchasing or configuring a hosting plan on GoDaddy, verify that the chosen plan meets the following technical specifications:

| Requirement | Recommended Setting | Minimum Supported |
| :--- | :--- | :--- |
| **Hosting Platform** | **GoDaddy cPanel Web Hosting (Linux)** or **VPS** | Linux Shared Hosting with cPanel |
| **Incompatible Plans** | **Avoid "Managed WordPress" plans** (they enforce WordPress rewrites and block custom API endpoints). | — |
| **PHP Version** | **PHP 8.2 or 8.3** (Selectable via cPanel MultiPHP Manager) | PHP 8.1 |
| **PHP Extensions** | `pdo_mysql`, `mbstring`, `fileinfo`, `curl`, `openssl`, `json` | Required |
| **Web Server** | Apache 2.4+ with `mod_rewrite` enabled | Required |
| **Database** | MySQL 8.0 or MariaDB 10.4+ | MySQL 5.7 |
| **SSL / HTTPS** | Free cPanel AutoSSL or Commercial GoDaddy SSL | Mandatory for secure admin sessions |

---

## 2. GoDaddy Directory Architecture

On GoDaddy cPanel, the web document root is typically `/home/<username>/public_html/`.

To ensure maximum security and seamless routing, the files should be arranged as follows:

```text
/home/<cpanel_user>/
│
├── almuheet_backend/           <-- Secure PHP backend OUTSIDE public web root
│   ├── config/
│   ├── src/
│   ├── uploads/                <-- Symlinked or served via public endpoint
│   ├── .env                    <-- Protected production database credentials
│   └── index.php
│
└── public_html/                <-- Public Web Document Root (almuheet.store)
    ├── assets/                 <-- React production bundle (from Vite dist/)
    ├── images/                 <-- Static luxury flacon photos
    ├── logo.svg
    ├── favicon.svg
    ├── index.html              <-- React entry point
    ├── .htaccess               <-- Handles SPA routing, API proxying, and HTTPS
    └── api/                    <-- Entry gateway to the PHP backend
        ├── index.php           <-- Bridges requests to almuheet_backend/index.php
        └── .htaccess
```

> **Alternative (Single Directory Deployment)**: If your GoDaddy plan does not permit access outside `public_html`, you can deploy `backend/` directly inside `public_html/api/` with strict `.htaccess` rules denying access to `.env`, `.sql`, and configuration files.

---

## 3. Database Setup in GoDaddy cPanel

1. Log in to your **GoDaddy Account** and open the **cPanel Dashboard**.
2. Navigate to **Databases** → **MySQL Databases Wizard**:
   - **Step 1: Create A Database**: Name the database (e.g., `almuheet_db`).
   - **Step 2: Create Database Users**: Enter a database user (e.g., `almuheet_user`) and generate a strong 20+ character password. **Record this password**.
   - **Step 3: Add User to the Database**: Select **ALL PRIVILEGES** and click **Make Changes**.
3. Open **phpMyAdmin** from cPanel:
   - Select your new database `almuheet_db` from the left sidebar.
   - Click the **Import** tab.
   - Click **Choose File** and select `database/schema.sql`.
   - Click **Go** at the bottom to create all tables.
   - Repeat the import for `database/seed.sql` if you wish to seed initial sample data or categories.

---

## 4. Configuring Backend Environment on GoDaddy

In your backend directory (`/home/<user>/almuheet_backend/` or `public_html/api/`), create or edit `.env`:

```env
# Production Environment for almuheet.store
DB_DRIVER=mysql
DB_HOST=localhost
DB_PORT=3306
DB_NAME=<cpanel_user>_almuheet_db
DB_USER=<cpanel_user>_almuheet_user
DB_PASS="YourActualSecurePasswordFromStep3"

# Cryptographic token key for admin authentication (use a random 64-character string)
JWT_SECRET="GenerateRandomLongSecretKey_93478912384729183472"

STORE_NAME="Al Muheet Fragrance"
DEFAULT_CURRENCY="PKR"

# Allowed CORS origins
CORS_ALLOWED_ORIGINS="https://almuheet.store,https://www.almuheet.store"
```

Set file permissions on `.env` to `600` via cPanel File Manager:
```bash
chmod 600 .env
```

Ensure the `uploads/` directory has write permissions:
```bash
chmod 755 uploads
```

---

## 5. Apache Rewrite Rules (`.htaccess`) for GoDaddy

Create `.htaccess` directly inside `public_html/` with the following configuration:

```apache
# ==========================================================
# Al Muheet Fragrance - GoDaddy Production .htaccess
# ==========================================================

<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteBase /

    # 1. Force HTTPS on GoDaddy
    RewriteCond %{HTTPS} off
    RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

    # 2. Fix GoDaddy FastCGI/PHP-FPM Bearer Token Stripping
    # Crucial for /admin JWT authentication!
    RewriteCond %{HTTP:Authorization} .
    RewriteRule .* - [E=HTTP_AUTHORIZATION:%{HTTP:Authorization}]
    SetEnvIf Authorization "(.*)" HTTP_AUTHORIZATION=$1

    # 3. Route API requests to PHP Backend
    RewriteRule ^api/(.*)$ api/index.php [QSA,L]

    # 4. Serve existing physical files or folders directly
    RewriteCond %{REQUEST_FILENAME} -f [OR]
    RewriteCond %{REQUEST_FILENAME} -d
    RewriteRule ^ - [L]

    # 5. Route all other requests (Storefront & Admin routes) to React index.html
    # This enables client-side routes like /admin, /shop, /checkout, /track-order
    RewriteRule ^ index.html [L]
</IfModule>

# Security: Prevent viewing of sensitive files
<FilesMatch "(\.env|\.sql|\.log|\.git)">
    Order allow,deny
    Deny from all
</FilesMatch>

# Security Headers
<IfModule mod_headers.c>
    Header set X-Content-Type-Options "nosniff"
    Header set X-Frame-Options "SAMEORIGIN"
    Header set X-XSS-Protection "1; mode=block"
</IfModule>
```

---

## 6. Building and Uploading the React Frontend

When you are ready to build for production:

1. In `frontend/.env.production` (or `frontend/.env`), set:
   ```env
   VITE_API_BASE_URL=https://almuheet.store/api
   ```
2. Build the optimized production bundle:
   ```bash
   cd frontend
   npm run build
   ```
3. Upload the contents of the `frontend/dist/` directory into your GoDaddy `public_html/`:
   - `dist/index.html` → `public_html/index.html`
   - `dist/assets/` → `public_html/assets/`
   - `dist/images/` → `public_html/images/`
   - `dist/favicon.svg` → `public_html/favicon.svg`
   - `dist/logo.svg` → `public_html/logo.svg`

---

## 7. Creating the Production Administrator

To create the initial production administrator securely without committing passwords to version control:

1. Connect to your GoDaddy server via **cPanel Terminal** or **SSH**.
2. Run the secure CLI creation script:
   ```bash
   php /path/to/backend/create_admin.php "Store Administrator" "admin@almuheet.store" "YourSuperSecurePassword"
   ```
3. You can now log in securely at `https://almuheet.store/admin/login`.

---

## 8. Common GoDaddy Shared Hosting Gotchas & Fixes

### Issue 1: 401 Unauthorized Error on Admin API Endpoints
- **Cause**: GoDaddy shared hosting runs PHP through FastCGI/PHP-FPM, which strips the `Authorization` header by default.
- **Fix**: Verify that `.htaccess` contains both `SetEnvIf Authorization "(.*)" HTTP_AUTHORIZATION=$1` and `RewriteRule .* - [E=HTTP_AUTHORIZATION:%{HTTP:Authorization}]`.

### Issue 2: 404 Not Found on Refreshing `/admin` or `/shop`
- **Cause**: Apache is looking for a physical `/admin` directory rather than rewriting to `index.html`.
- **Fix**: Verify `.htaccess` has `RewriteRule ^ index.html [L]` at the end of the rule list.

### Issue 3: Image Upload Errors
- **Cause**: PHP `upload_max_filesize` or write permissions.
- **Fix**: In cPanel **Select PHP Version** → **Options**, set `upload_max_filesize = 16M` and `post_max_size = 20M`. Verify `backend/uploads/` is `chmod 755`.
