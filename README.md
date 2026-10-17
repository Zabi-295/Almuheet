# Al Muheet Fragrance (الهام المحيط للعطور)
**Haute Parfumerie · Arabian Agarwood & French Floral Extrait**  
**Official Market**: Pakistan | **Currency**: PKR (₨) | **Payment**: 100% Cash on Delivery (COD)

---

## Quick Start (Local Development)

The application runs entirely locally on your machine without requiring a live domain, paid hosting, or external API keys.

### 1. Initialize the Database
```bash
php backend/setup.php
```
*Automatically boots with MySQL (XAMPP) or seamless local SQLite fallback.*

### 2. Start the PHP REST API (Port 8000)
```bash
php -S localhost:8000 backend/index.php
```
*API is accessible at `http://localhost:8000/api`.*

### 3. Start the React + Vite Frontend (Port 5173)
```bash
cd frontend
npm install
npm run dev
```

- **Customer Storefront**: [http://localhost:5173](http://localhost:5173)
- **Administrator Portal**: [http://localhost:5173/admin](http://localhost:5173/admin)

---

## Administrator Access

- **Login URL**: [http://localhost:5173/admin/login](http://localhost:5173/admin/login)
- **Default Email**: `admin@almuheet.store`
- **Default Password**: `Admin@12345`

To create or modify administrator credentials locally:
```bash
php backend/create_admin.php "Your Name" "admin@almuheet.store" "YourPassword"
```

---

## Project Structure

```text
/AlMuheet
├── /frontend       # React 19 + Vite luxury storefront and admin dashboard
├── /backend        # PHP 8.1+ REST API (CORS, JWT Authentication, Controllers)
├── /database       # MySQL schema.sql, seed.sql, and local SQLite database
└── /docs           # LOCAL_SETUP.md, GODADDY_DEPLOYMENT.md, API_DOCUMENTATION.md, DATABASE_SCHEMA.md
```

---

## Documentation

- [Local Development Setup Guide](docs/LOCAL_SETUP.md)
- [GoDaddy Deployment Blueprint for almuheet.store](docs/GODADDY_DEPLOYMENT.md)
- [REST API Endpoint Documentation](docs/API_DOCUMENTATION.md)
- [Database Schema Reference](docs/DATABASE_SCHEMA.md)
