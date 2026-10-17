<?php
// ==========================================================
// Al Muheet Fragrance - Database Connection Manager
// Supports MySQL (Production / XAMPP) with Local SQLite fallback
// ==========================================================

require_once __DIR__ . '/config.php';

class Database {
    private static ?PDO $instance = null;
    private static string $driverUsed = 'mysql';

    public static function getConnection(): PDO {
        if (self::$instance !== null) {
            return self::$instance;
        }

        $driver = strtolower(env('DB_DRIVER', 'mysql'));
        $host   = env('DB_HOST', '127.0.0.1');
        $port   = env('DB_PORT', '3306');
        $dbname = env('DB_NAME', 'almuheet_db');
        $user   = env('DB_USER', 'root');
        $pass   = env('DB_PASS', '');

        if ($driver === 'mysql') {
            try {
                $dsn = "mysql:host={$host};port={$port};dbname={$dbname};charset=utf8mb4";
                $options = [
                    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                    PDO::ATTR_EMULATE_PREPARES   => false,
                    PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8mb4"
                ];
                self::$instance = new PDO($dsn, $user, $pass, $options);
                self::$driverUsed = 'mysql';
                return self::$instance;
            } catch (PDOException $e) {
                // If MySQL is not reachable locally (e.g. XAMPP MySQL not started),
                // fall back to SQLite so local development works immediately!
                error_log("MySQL connection failed: " . $e->getMessage() . ". Switching to local SQLite fallback.");
                return self::initSqliteFallback();
            }
        } else {
            return self::initSqliteFallback();
        }
    }

    public static function getDriverUsed(): string {
        return self::$driverUsed;
    }

    private static function initSqliteFallback(): PDO {
        $sqlitePath = dirname(__DIR__, 2) . '/database/almuheet.sqlite';
        $isNew = !file_exists($sqlitePath) || filesize($sqlitePath) === 0;

        $dsn = "sqlite:" . $sqlitePath;
        $pdo = new PDO($dsn);
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
        $pdo->exec("PRAGMA foreign_keys = ON;");

        self::$instance = $pdo;
        self::$driverUsed = 'sqlite';

        if ($isNew) {
            self::bootstrapSqlite($pdo);
        }

        return self::$instance;
    }

    public static function bootstrapSqlite(PDO $pdo): void {
        // Create SQLite tables corresponding to the MySQL schema
        $pdo->exec("
            CREATE TABLE IF NOT EXISTS settings (
                key_name TEXT PRIMARY KEY,
                value_text TEXT NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS admins (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                email TEXT NOT NULL UNIQUE,
                password TEXT NOT NULL,
                role TEXT DEFAULT 'admin',
                last_login DATETIME NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS categories (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                slug TEXT NOT NULL UNIQUE,
                description TEXT NULL,
                image_url TEXT NULL,
                is_featured INTEGER DEFAULT 0,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS products (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                slug TEXT NOT NULL UNIQUE,
                category_id INTEGER NULL,
                short_description TEXT NULL,
                description TEXT NULL,
                price REAL NOT NULL,
                compare_at_price REAL NULL,
                stock_quantity INTEGER NOT NULL DEFAULT 0,
                sku TEXT NOT NULL UNIQUE,
                image_url TEXT NOT NULL,
                gallery TEXT NULL,
                volume TEXT DEFAULT '100ml',
                concentration TEXT DEFAULT 'Extrait de Parfum',
                gender TEXT DEFAULT 'Unisex',
                top_notes TEXT NULL,
                heart_notes TEXT NULL,
                base_notes TEXT NULL,
                longevity TEXT DEFAULT '12+ Hours',
                sillage TEXT DEFAULT 'Strong / Enveloping',
                is_featured INTEGER DEFAULT 0,
                is_sample INTEGER DEFAULT 1,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (category_id) REFERENCES categories (id) ON DELETE SET NULL
            );

            CREATE TABLE IF NOT EXISTS orders (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                order_number TEXT NOT NULL UNIQUE,
                customer_name TEXT NOT NULL,
                customer_phone TEXT NOT NULL,
                customer_email TEXT NULL,
                delivery_address TEXT NOT NULL,
                city TEXT NOT NULL,
                postal_code TEXT NULL,
                order_notes TEXT NULL,
                payment_method TEXT DEFAULT 'Cash on Delivery',
                subtotal REAL NOT NULL,
                shipping_fee REAL DEFAULT 0.0,
                total_amount REAL NOT NULL,
                order_status TEXT DEFAULT 'pending',
                is_sample INTEGER DEFAULT 0,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS order_items (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                order_id INTEGER NOT NULL,
                product_id INTEGER NULL,
                product_name TEXT NOT NULL,
                price REAL NOT NULL,
                quantity INTEGER NOT NULL DEFAULT 1,
                subtotal REAL NOT NULL,
                FOREIGN KEY (order_id) REFERENCES orders (id) ON DELETE CASCADE,
                FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE SET NULL
            );

            CREATE TABLE IF NOT EXISTS inventory_logs (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                product_id INTEGER NOT NULL,
                change_amount INTEGER NOT NULL,
                new_stock INTEGER NOT NULL,
                type TEXT NOT NULL,
                notes TEXT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE CASCADE
            );
        ");

        // Seed initial data
        $adminHash = '$2y$10$J79qkwIWut7FvFSR79.eq.i0DlY6RSThKRhqI4k6JQnDnW8SgGmxy'; // Admin@12345
        $pdo->exec("
            INSERT OR IGNORE INTO admins (id, name, email, password, role) 
            VALUES (1, 'Store Administrator', 'admin@almuheet.store', '{$adminHash}', 'superadmin');

            INSERT OR IGNORE INTO settings (key_name, value_text) VALUES
            ('store_name', 'Al Muheet Fragrance'),
            ('store_tagline', 'The Pinnacle of Arabian & French Haute Parfumerie'),
            ('currency', 'PKR'),
            ('currency_symbol', '₨'),
            ('contact_email', 'concierge@almuheet.store'),
            ('contact_phone', '+92 300 8472910'),
            ('whatsapp_number', '+92 300 8472910'),
            ('store_address', 'Suite 402, Luxury Galleria, MM Alam Road, Gulberg III, Lahore, Pakistan'),
            ('shipping_fee', '250'),
            ('free_shipping_threshold', '6000'),
            ('announcement_banner', '✨ Complimentary Luxury Delivery across Pakistan on Orders Above PKR 6,000 | 100% Handcrafted Extrait de Parfum ✨'),
            ('cod_policy_note', 'Cash on Delivery (COD) available nationwide. Inspect parcel packaging upon delivery.');

            INSERT OR IGNORE INTO categories (id, name, slug, description, image_url, is_featured) VALUES
            (1, 'Royal Oud & Oriental', 'royal-oud-oriental', 'Majestic Agarwood from Assam and Cambodia, blended with precious amber and warm saffron.', '/images/royal-oud.jpg', 1),
            (2, 'Floral & Rose Extrait', 'floral-rose-extrait', 'Pure Damask Rose de Mai infused with golden ambergris and velvet peony.', '/images/rose-taif.jpg', 1),
            (3, 'Smoky Woods & Incense', 'smoky-woods-incense', 'Deep Frankincense from Dhofar, smoky birch tar, and dark woods.', '/images/sapphire-smoke.jpg', 1),
            (4, 'Amber, Musk & Vanilla', 'amber-musk-vanilla', 'Silken vanilla pods from Madagascar, white cashmere musk, and radiant solar amber.', '/images/musk-cashmere.jpg', 1);

            INSERT OR IGNORE INTO products (id, name, slug, category_id, short_description, description, price, compare_at_price, stock_quantity, sku, image_url, gallery, volume, concentration, gender, top_notes, heart_notes, base_notes, longevity, sillage, is_featured, is_sample) VALUES
            (1, 'Al Muheet Royal Oud Extrait', 'al-muheet-royal-oud-extrait', 1, 'Our crown jewel: rare wild Assamese agarwood paired with vintage amber and smoked saffron.', 'Handcrafted in limited batches, Al Muheet Royal Oud Extrait embodies the zenith of Eastern luxury perfumery. Sourced from aged Agarwood trees and macerated for six months with rare amber resin, this formulation exudes absolute authority, warmth, and opulence.', 11500.00, 13800.00, 24, 'AM-RO-100', '/images/royal-oud.jpg', '[\"/images/royal-oud.jpg\", \"/images/hero.jpg\"]', '100ml', 'Extrait de Parfum (35% Oil)', 'Unisex', 'Smoked Saffron, Sicilian Bergamot, Pink Peppercorn', 'Assamese Agarwood (Oud), Damascena Rose, Nutmeg', 'Golden Amber, Virginian Cedarwood, Dark Musk', '16+ Hours', 'Enveloping & Heavy', 1, 1),
            (2, 'Rose & Amber Imperial', 'rose-amber-imperial', 2, 'An intoxicating duet of Taif and May roses cradled by golden crystalline ambergris.', 'Rose & Amber Imperial is a tribute to the royal gardens of the East. Opening with dewy nectar and Turkish rose petals, the fragrance deepens into a velvety warmth of amber crystals and bourbon vanilla.', 8900.00, 10500.00, 38, 'AM-RA-100', '/images/rose-taif.jpg', '[\"/images/rose-taif.jpg\"]', '100ml', 'Extrait de Parfum (30% Oil)', 'Pour Femme / Unisex', 'Dewy Taif Rose, Mandarine Zest, Lychee', 'Rose de Mai Absolute, French Peony, Honey Accord', 'Ambergris, Madagascar Vanilla, White Cashmere', '12+ Hours', 'Moderate to Strong', 1, 1),
            (3, 'Midnight Sapphire Oud', 'midnight-sapphire-oud', 3, 'Intense Dhofar incense entwined with dark sapphire leather and smoky vetiver.', 'Evoking a cool moonlit night across Arabian dunes, Midnight Sapphire opens with brisk cardamom and incense smoke before settling into an unforgettable veil of dark leather, vetiver, and midnight agarwood.', 9400.00, 11200.00, 19, 'AM-MS-100', '/images/sapphire-smoke.jpg', '[\"/images/sapphire-smoke.jpg\"]', '100ml', 'Eau de Parfum Intense', 'Pour Homme / Unisex', 'Green Cardamom, Italian Juniper, Bergamot', 'Dhofar Frankincense, Birch Smoke, Orris Root', 'Dark Sapphire Leather, Haitian Vetiver, Midnight Oud', '14+ Hours', 'Strong Sillage', 1, 1),
            (4, 'Velvet Musk & Cashmere', 'velvet-musk-cashmere', 4, 'A soft, sensual cloud of white amber, whipped vanilla bean, and pure cashmere.', 'Subtle yet impossible to forget, Velvet Musk & Cashmere wraps the wearer in an intoxicating embrace of golden Madagascar vanilla, powdered tonka bean, and luxurious clean musk.', 7900.00, 9200.00, 45, 'AM-VM-100', '/images/musk-cashmere.jpg', '[\"/images/musk-cashmere.jpg\"]', '100ml', 'Extrait de Parfum (30% Oil)', 'Unisex', 'White Peach, Bergamot Sparkle, Heliotrope', 'Madagascar Vanilla Orchid, Tonka Bean, Almond Cream', 'Pure Cashmere Musk, White Cedar, Amber Glow', '12+ Hours', 'Intimate to Moderate', 1, 1);
        ");
    }
}
