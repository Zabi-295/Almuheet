-- ==========================================================
-- Al Muheet Fragrance - Seed Data
-- Currency: PKR | Local Sample Data clearly identified with is_sample = 1
-- ==========================================================

-- 1. Store Settings
INSERT INTO `settings` (`key_name`, `value_text`) VALUES
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
('cod_policy_note', 'Cash on Delivery (COD) available nationwide. Inspect parcel packaging upon delivery.')
ON DUPLICATE KEY UPDATE `value_text` = VALUES(`value_text`);

-- 2. Initial Administrator (For local development testing)
-- Email: admin@almuheet.store | Password: Admin@12345
-- Run "php backend/create_admin.php" to create or update admins with custom passwords
INSERT INTO `admins` (`name`, `email`, `password`, `role`) VALUES
('Store Administrator', 'admin@almuheet.store', '$2y$10$J79qkwIWut7FvFSR79.eq.i0DlY6RSThKRhqI4k6JQnDnW8SgGmxy', 'superadmin')
ON DUPLICATE KEY UPDATE `name` = VALUES(`name`);

-- 3. Categories
INSERT INTO `categories` (`id`, `name`, `slug`, `description`, `image_url`, `is_featured`) VALUES
(1, 'Royal Oud & Oriental', 'royal-oud-oriental', 'Majestic Agarwood from Assam and Cambodia, blended with precious amber and warm saffron.', '/images/royal-oud.jpg', 1),
(2, 'Floral & Rose Extrait', 'floral-rose-extrait', 'Pure Damask Rose de Mai infused with golden ambergris and velvet peony.', '/images/rose-taif.jpg', 1),
(3, 'Smoky Woods & Incense', 'smoky-woods-incense', 'Deep Frankincense from Dhofar, smoky birch tar, and dark woods.', '/images/sapphire-smoke.jpg', 1),
(4, 'Amber, Musk & Vanilla', 'amber-musk-vanilla', 'Silken vanilla pods from Madagascar, white cashmere musk, and radiant solar amber.', '/images/musk-cashmere.jpg', 1)
ON DUPLICATE KEY UPDATE `name` = VALUES(`name`);

-- 4. Sample Products (is_sample = 1)
INSERT INTO `products` (`id`, `name`, `slug`, `category_id`, `short_description`, `description`, `price`, `compare_at_price`, `stock_quantity`, `sku`, `image_url`, `gallery`, `volume`, `concentration`, `gender`, `top_notes`, `heart_notes`, `base_notes`, `longevity`, `sillage`, `is_featured`, `is_sample`) VALUES
(1, 'Al Muheet Royal Oud Extrait', 'al-muheet-royal-oud-extrait', 1, 'Our crown jewel: rare wild Assamese agarwood paired with vintage amber and smoked saffron.', 'Handcrafted in limited batches, Al Muheet Royal Oud Extrait embodies the zenith of Eastern luxury perfumery. Sourced from aged Agarwood trees and macerated for six months with rare amber resin, this formulation exudes absolute authority, warmth, and opulence.', 11500.00, 13800.00, 24, 'AM-RO-100', '/images/royal-oud.jpg', '["/images/royal-oud.jpg", "/images/hero.jpg"]', '100ml', 'Extrait de Parfum (35% Oil)', 'Unisex', 'Smoked Saffron, Sicilian Bergamot, Pink Peppercorn', 'Assamese Agarwood (Oud), Damascena Rose, Nutmeg', 'Golden Amber, Virginian Cedarwood, Dark Musk', '16+ Hours', 'Enveloping & Heavy', 1, 1),

(2, 'Rose & Amber Imperial', 'rose-amber-imperial', 2, 'An intoxicating duet of Taif and May roses cradled by golden crystalline ambergris.', 'Rose & Amber Imperial is a tribute to the royal gardens of the East. Opening with dewy nectar and Turkish rose petals, the fragrance deepens into a velvety warmth of amber crystals and bourbon vanilla.', 8900.00, 10500.00, 38, 'AM-RA-100', '/images/rose-taif.jpg', '["/images/rose-taif.jpg"]', '100ml', 'Extrait de Parfum (30% Oil)', 'Pour Femme / Unisex', 'Dewy Taif Rose, Mandarine Zest, Lychee', 'Rose de Mai Absolute, French Peony, Honey Accord', 'Ambergris, Madagascar Vanilla, White Cashmere', '12+ Hours', 'Moderate to Strong', 1, 1),

(3, 'Midnight Sapphire Oud', 'midnight-sapphire-oud', 3, 'Intense Dhofar incense entwined with dark sapphire leather and smoky vetiver.', 'Evoking a cool moonlit night across Arabian dunes, Midnight Sapphire opens with brisk cardamom and incense smoke before settling into an unforgettable veil of dark leather, vetiver, and midnight agarwood.', 9400.00, 11200.00, 19, 'AM-MS-100', '/images/sapphire-smoke.jpg', '["/images/sapphire-smoke.jpg"]', '100ml', 'Eau de Parfum Intense', 'Pour Homme / Unisex', 'Green Cardamom, Italian Juniper, Bergamot', 'Dhofar Frankincense, Birch Smoke, Orris Root', 'Dark Sapphire Leather, Haitian Vetiver, Midnight Oud', '14+ Hours', 'Strong Sillage', 1, 1),

(4, 'Velvet Musk & Cashmere', 'velvet-musk-cashmere', 4, 'A soft, sensual cloud of white amber, whipped vanilla bean, and pure cashmere.', 'Subtle yet impossible to forget, Velvet Musk & Cashmere wraps the wearer in an intoxicating embrace of golden Madagascar vanilla, powdered tonka bean, and luxurious clean musk.', 7900.00, 9200.00, 45, 'AM-VM-100', '/images/musk-cashmere.jpg', '["/images/musk-cashmere.jpg"]', '100ml', 'Extrait de Parfum (30% Oil)', 'Unisex', 'White Peach, Bergamot Sparkle, Heliotrope', 'Madagascar Vanilla Orchid, Tonka Bean, Almond Cream', 'Pure Cashmere Musk, White Cedar, Amber Glow', '12+ Hours', 'Intimate to Moderate', 1, 1)
ON DUPLICATE KEY UPDATE `name` = VALUES(`name`);

-- Orders table is kept completely clean for real customer and test COD orders.

