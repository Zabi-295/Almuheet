# Al Muheet Fragrance — Local Development & Setup Guide

This guide documents how to run **Al Muheet Fragrance** completely locally on Windows, macOS, or Linux without requiring a live domain, paid hosting, or third-party external services.

---

## 1. Project Directory Architecture

```text
/AlMuheet
├── /frontend          # React + Vite luxury e-commerce application
│   ├── /src
│   │   ├── /components  # Storefront & Admin components
│   │   ├── /context     # Settings, Auth, and Cart state providers
│   │   ├── /pages       # Storefront & Admin views
│   │   ├── api.js       # API client with JWT bearer header
│   │   └── index.css    # Obsidian & champagne gold luxury design system
│   ├── /public          # Brand logo, favicon, and fragrance imagery
│   ├── .env             # VITE_API_BASE_URL=http://localhost:8000/api
│   └── package.json
├── /backend           # PHP 8.1+ REST API
│   ├── /config          # Database connection (MySQL with SQLite fallback) & CORS
│   ├── /src             # JWT Auth engine, JSON Response, Router, & Controllers
│   ├── /uploads         # Uploaded perfume flacon images
│   ├── index.php        # Central entry point and static asset server
│   ├── setup.php        # CLI database initialization and migration tool
│   ├── create_admin.php # Secure administrator creation utility
│   ├── .env             # Local environment database credentials
│   └── .htaccess        # Apache rewrite rules
├── /database          # Database definitions
│   ├── schema.sql       # MySQL DDL schema
│   ├── seed.sql         # Sample fragrances, orders, and initial admin
│   └── almuheet.sqlite  # Zero-config local database file (auto-generated)
└── /docs              # Technical documentation & GoDaddy deployment blueprints
```

---

## 2. Prerequisites Installed

- **Node.js**: v18.0.0 or higher (`node -v`)
- **PHP**: PHP 8.1, 8.2, or 8.3 (`php -v`) with PDO, `pdo_mysql`, `pdo_sqlite`, `curl`, `mbstring`, `fileinfo`, `openssl` enabled.
- **MySQL**: (Optional for local testing) MySQL 5.7+ / 8.0+ through XAMPP, MariaDB, or standalone MySQL.

---

## 3. Database Initialization (Dual-Engine Support)

Al Muheet Fragrance features an automated dual-engine database layer:
- **MySQL Mode (Default for XAMPP & GoDaddy)**: If MySQL is running on port 3306, it connects and uses MySQL.
- **Zero-Config Local Fallback**: If MySQL is not currently running, it automatically operates on local SQLite (`database/almuheet.sqlite`) with the exact same schema, sample data, and admin authentication.

### Running the Database Setup Tool

Open your terminal in the project root:

```bash
php backend/setup.php
```

This command will:
1. Check for active MySQL on `127.0.0.1:3306`.
2. Create the `almuheet_db` database if missing.
3. Import `database/schema.sql` and `database/seed.sql`.
4. If MySQL is offline, it automatically seeds `database/almuheet.sqlite`.

---

## 4. Starting the Local Servers

### Step A: Start the PHP API Server (Port 8000)

From the project root:

```bash
php -S localhost:8000 backend/index.php
```

- API Base URL: `http://localhost:8000/api`
- Test Health: Open `http://localhost:8000/api` in your browser.

### Step B: Start the React + Vite Frontend (Port 5173)

Open a second terminal window in the `frontend` folder:

```bash
cd frontend
npm install
npm run dev
```

- Storefront URL: `http://localhost:5173`
- Admin Portal URL: `http://localhost:5173/admin`

---

## 5. Administrator Portal Credentials

- **Admin Login Route**: `http://localhost:5173/admin/login`
- **Default Email**: `admin@almuheet.store`
- **Default Password**: `Admin@12345`

### Creating or Updating Administrators Locally

To create a new administrator with a custom password without hardcoding:

```bash
php backend/create_admin.php "Your Name" "admin@almuheet.store" "YourSecurePassword"
```

Or run interactively:

```bash
php backend/create_admin.php
```

---

## 6. Managing Sample Products vs Client Data

All sample products are marked with `is_sample = 1`.

When the customer provides their real perfume flacon images, prices, stock, and descriptions:
1. Log in to the Admin Panel at `http://localhost:5173/admin/login`.
2. Go to **Products** (`/admin/products`).
3. Click the purple button **"Clear Sample Products"** to wipe sample records in one click.
4. Click **"Add New Fragrance"** to input the customer's actual perfume inventory.
