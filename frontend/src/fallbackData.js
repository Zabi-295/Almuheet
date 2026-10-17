// ==========================================================
// Al Muheet Fragrance - Demo & Fallback Data
// Provides high-fidelity offline/preview catalog & order data
// when running on Vercel preview or static hosting
// ==========================================================

export const FALLBACK_SETTINGS = {
  store_name: 'Al Muheet Fragrance',
  store_tagline: 'The Pinnacle of Arabian & French Haute Parfumerie',
  currency: 'PKR',
  currency_symbol: 'Rs. ',
  contact_email: 'concierge@almuheet.store',
  contact_phone: '+92 300 8472910',
  whatsapp_number: '923008472910',
  store_address: 'Suite 402, Luxury Galleria, MM Alam Road, Gulberg III, Lahore, Pakistan',
  shipping_fee: 250,
  free_shipping_threshold: 6000,
  announcement_banner: '✨ Complimentary Luxury Delivery across Pakistan on Orders Above PKR 6,000 | 100% Handcrafted Extrait de Parfum ✨',
  cod_policy_note: 'Cash on Delivery (COD) available nationwide. Inspect parcel packaging upon delivery.'
};

export const FALLBACK_CATEGORIES = [
  { id: 1, name: 'Executive Range', slug: 'executive-range', description: 'Crisp, commanding signature scents crafted for boardroom presence and daily elegance.', image_url: '/images/hero.jpg', is_featured: 1 },
  { id: 2, name: 'Royal Oud & Oriental', slug: 'royal-oud', description: 'Rare wild agarwood, ambergris, and deep Arabian orientals.', image_url: '/images/royal-oud.jpg', is_featured: 1 },
  { id: 3, name: 'Poetic Range', slug: 'poetic-range', description: 'Artistic expressions of passion, longing, and unforgettable memories.', image_url: '/images/green-velvet.jpg', is_featured: 1 },
  { id: 4, name: 'Sensory Range', slug: 'sensory-range', description: 'Velvety musks, French florals, and captivating fruity-amber compositions.', image_url: '/images/blush-peony.jpg', is_featured: 1 },
  { id: 5, name: 'Discovery & Tester Box', slug: 'tester-box', description: 'Compact 10ml flacons designed to explore our entire fragrance vault.', image_url: '/images/discovery-set.jpg', is_featured: 1 },
  { id: 6, name: 'Gift Box & Bundles', slug: 'gift-box', description: 'Prestige luxury sets packaged in handcrafted velvet-lined gift boxes.', image_url: '/images/arabian-eagle.jpg', is_featured: 1 }
];

export const FALLBACK_PRODUCTS = [
  {
    id: 1,
    name: 'Autumn Story',
    slug: 'autumn-story',
    category_id: 1,
    category_name: 'Executive Range',
    short_description: 'Executive Range | 100ml Eau de Parfum. Roasted tonka bean, amber and autumn woods.',
    description: 'When seasons become stories. Autumn Story evokes crisp amber air, golden maple foliage, roasted tonka beans, and noble cedarwood. A commanding signature for the discerning gentleman.',
    price: 2500,
    compare_at_price: 3400,
    stock_quantity: 120,
    sku: 'AM-EXE-AUTUMN',
    image_url: '/images/hero.jpg',
    gallery: '["/images/hero.jpg", "/images/autumn-hero.jpg"]',
    volume: '100ml',
    concentration: 'Eau de Parfum',
    gender: 'Men',
    top_notes: 'Crisp Bergamot, Cardamom, Autumn Leaves',
    heart_notes: 'Roasted Tonka Bean, Virginia Cedar, Cinnamon',
    base_notes: 'Amber Resin, Cashmere Wood, Warm Musk',
    longevity: '12+ Hours',
    sillage: 'Strong Sillage',
    is_featured: 1,
    is_sample: 0
  },
  {
    id: 2,
    name: 'Catch 22',
    slug: 'catch-22',
    category_id: 1,
    category_name: 'Executive Range',
    short_description: 'Executive Range | 100ml Eau de Parfum. Smoky pineapple, black birch, and ambergris.',
    description: 'An iconic modern powerhouse. Catch 22 opens with juicy pineapple and crisp blackcurrant, evolving into a heart of smoky birch bark and jasmine, resting upon a base of rich oakmoss and ambergris.',
    price: 1990,
    compare_at_price: 2800,
    stock_quantity: 85,
    sku: 'AM-EXE-CATCH22',
    image_url: '/images/sapphire-smoke.jpg',
    gallery: '["/images/sapphire-smoke.jpg"]',
    volume: '100ml',
    concentration: 'Eau de Parfum',
    gender: 'Men',
    top_notes: 'Smoky Pineapple, Blackcurrant, Italian Bergamot',
    heart_notes: 'Smoky Birch Bark, Patchouli, Moroccan Jasmine',
    base_notes: 'Ambergris, Oakmoss, Royal Musk',
    longevity: '14+ Hours',
    sillage: 'Heavy Projection',
    is_featured: 1,
    is_sample: 0
  },
  {
    id: 3,
    name: 'Dauntless',
    slug: 'dauntless',
    category_id: 1,
    category_name: 'Executive Range',
    short_description: 'Executive Range | 100ml Eau de Parfum. Aquatic citrus, lavender, and magnetic ambroxan.',
    description: 'Bold, daring, and magnetic. Dauntless commands attention with a burst of frosted grapefruit and salty ocean accord, followed by aristocratic French lavender and warm cedarwood.',
    price: 2350,
    compare_at_price: 3100,
    stock_quantity: 64,
    sku: 'AM-EXE-DAUNT',
    image_url: '/images/royal-oud.jpg',
    gallery: '["/images/royal-oud.jpg"]',
    volume: '100ml',
    concentration: 'Eau de Parfum',
    gender: 'Men',
    top_notes: 'Frosted Grapefruit, Marine Accord, Mandarin',
    heart_notes: 'Bay Leaf, French Lavender, Hedione',
    base_notes: 'Ambroxan, Guaiac Wood, Oakmoss',
    longevity: '12+ Hours',
    sillage: 'Moderate to Strong',
    is_featured: 1,
    is_sample: 0
  },
  {
    id: 4,
    name: 'Tarzan',
    slug: 'tarzan',
    category_id: 1,
    category_name: 'Executive Range',
    short_description: 'Executive Range | 100ml Eau de Parfum. Wild vetiver, pepper, and untamed green jungle cedar.',
    description: 'An ode to primordial earth and wild nature. Tarzan combines fiery Sichuan pepper with green vetiver roots, resinous cypress, and earthy patchouli. For the adventurous spirit.',
    price: 2150,
    compare_at_price: 2900,
    stock_quantity: 42,
    sku: 'AM-EXE-TARZAN',
    image_url: '/images/green-velvet.jpg',
    gallery: '["/images/green-velvet.jpg"]',
    volume: '100ml',
    concentration: 'Eau de Parfum',
    gender: 'Men',
    top_notes: 'Sichuan Pepper, Bitter Orange, Pink Pepper',
    heart_notes: 'Vetiver Root, Resinous Cypress, Geranium',
    base_notes: 'Atlas Cedar, Indonesian Patchouli, Benzoin',
    longevity: '10+ Hours',
    sillage: 'Intimate to Moderate',
    is_featured: 1,
    is_sample: 0
  },
  {
    id: 5,
    name: 'Al Muheet Royal Oud Extrait',
    slug: 'al-muheet-royal-oud-extrait',
    category_id: 2,
    category_name: 'Royal Oud & Oriental',
    short_description: '35% Oil Extrait de Parfum | 100ml. Wild Assamese agarwood with vintage amber and smoked saffron.',
    description: 'Handcrafted in limited batches, Al Muheet Royal Oud Extrait embodies the zenith of Eastern luxury perfumery. Sourced from aged Agarwood trees and macerated for six months with rare amber resin.',
    price: 11500,
    compare_at_price: 13800,
    stock_quantity: 24,
    sku: 'AM-RO-100',
    image_url: '/images/royal-oud.jpg',
    gallery: '["/images/royal-oud.jpg", "/images/hero.jpg"]',
    volume: '100ml',
    concentration: 'Extrait de Parfum (35% Oil)',
    gender: 'Unisex',
    top_notes: 'Smoked Saffron, Sicilian Bergamot, Pink Peppercorn',
    heart_notes: 'Assamese Agarwood (Oud), Damascena Rose, Nutmeg',
    base_notes: 'Golden Amber, Virginian Cedarwood, Dark Musk',
    longevity: '16+ Hours',
    sillage: 'Enveloping & Heavy',
    is_featured: 1,
    is_sample: 0
  },
  {
    id: 6,
    name: 'Rose & Amber Imperial',
    slug: 'rose-amber-imperial',
    category_id: 2,
    category_name: 'Royal Oud & Oriental',
    short_description: '30% Oil Extrait de Parfum | 100ml. Taif and May roses cradled by golden crystalline ambergris.',
    description: 'A tribute to the royal gardens of the East. Opening with dewy nectar and Turkish rose petals, the fragrance deepens into a velvety warmth of amber crystals and bourbon vanilla.',
    price: 8900,
    compare_at_price: 10500,
    stock_quantity: 38,
    sku: 'AM-RA-100',
    image_url: '/images/rose-taif.jpg',
    gallery: '["/images/rose-taif.jpg"]',
    volume: '100ml',
    concentration: 'Extrait de Parfum (30% Oil)',
    gender: 'Unisex',
    top_notes: 'Dewy Taif Rose, Mandarine Zest, Lychee',
    heart_notes: 'Rose de Mai Absolute, French Peony, Honey Accord',
    base_notes: 'Ambergris, Madagascar Vanilla, White Cashmere',
    longevity: '12+ Hours',
    sillage: 'Moderate to Strong',
    is_featured: 1,
    is_sample: 0
  },
  {
    id: 7,
    name: 'Midnight Sapphire Oud',
    slug: 'midnight-sapphire-oud',
    category_id: 2,
    category_name: 'Royal Oud & Oriental',
    short_description: 'Eau de Parfum Intense | 100ml. Intense Dhofar incense entwined with dark sapphire leather and midnight oud.',
    description: 'Evoking a cool moonlit night across Arabian dunes, Midnight Sapphire opens with brisk cardamom and incense smoke before settling into an unforgettable veil of dark leather, vetiver, and midnight agarwood.',
    price: 9400,
    compare_at_price: 11200,
    stock_quantity: 19,
    sku: 'AM-MS-100',
    image_url: '/images/sapphire-smoke.jpg',
    gallery: '["/images/sapphire-smoke.jpg"]',
    volume: '100ml',
    concentration: 'Eau de Parfum Intense',
    gender: 'Unisex',
    top_notes: 'Green Cardamom, Italian Juniper, Bergamot',
    heart_notes: 'Dhofar Frankincense, Birch Smoke, Orris Root',
    base_notes: 'Dark Sapphire Leather, Haitian Vetiver, Midnight Oud',
    longevity: '14+ Hours',
    sillage: 'Strong Sillage',
    is_featured: 1,
    is_sample: 0
  },
  {
    id: 8,
    name: 'Velvet Musk & Cashmere',
    slug: 'velvet-musk-cashmere',
    category_id: 4,
    category_name: 'Sensory Range',
    short_description: '30% Oil Extrait de Parfum | 100ml. White amber, whipped vanilla bean, and pure cashmere.',
    description: 'Subtle yet impossible to forget, Velvet Musk & Cashmere wraps the wearer in an intoxicating embrace of golden Madagascar vanilla, powdered tonka bean, and luxurious clean musk.',
    price: 7900,
    compare_at_price: 9200,
    stock_quantity: 45,
    sku: 'AM-VM-100',
    image_url: '/images/musk-cashmere.jpg',
    gallery: '["/images/musk-cashmere.jpg"]',
    volume: '100ml',
    concentration: 'Extrait de Parfum (30% Oil)',
    gender: 'Unisex',
    top_notes: 'White Peach, Bergamot Sparkle, Heliotrope',
    heart_notes: 'Madagascar Vanilla Orchid, Tonka Bean, Almond Cream',
    base_notes: 'Pure Cashmere Musk, White Cedar, Amber Glow',
    longevity: '12+ Hours',
    sillage: 'Intimate to Moderate',
    is_featured: 1,
    is_sample: 0
  },
  {
    id: 9,
    name: 'Discovery Tester Vault (Set of 6)',
    slug: 'discovery-tester-vault',
    category_id: 5,
    category_name: 'Discovery & Tester Box',
    short_description: 'Discovery Box | 6 x 10ml Luxury Flacons. Explore our signature best-sellers in one collector box.',
    description: 'The definitive Al Muheet experience. Contains 6 x 10ml travel-ready flacons of Autumn Story, Catch 22, Royal Oud Extrait, Rose & Amber, Dauntless, and Velvet Musk. Includes a PKR 1,000 store voucher.',
    price: 3200,
    compare_at_price: 4500,
    stock_quantity: 50,
    sku: 'AM-BOX-DISC6',
    image_url: '/images/discovery-set.jpg',
    gallery: '["/images/discovery-set.jpg"]',
    volume: '6 x 10ml',
    concentration: 'Extrait & EDP',
    gender: 'Unisex',
    top_notes: 'Assorted Best-Sellers Accord',
    heart_notes: 'Precious Woods, Florals & Spices',
    base_notes: 'Oud, Amber, Musk & Cashmere',
    longevity: '12+ Hours',
    sillage: 'Variable by Flacon',
    is_featured: 1,
    is_sample: 0
  },
  {
    id: 10,
    name: 'Arabian Eagle Imperial Gift Set',
    slug: 'arabian-eagle-imperial-gift-set',
    category_id: 6,
    category_name: 'Gift Box & Bundles',
    short_description: 'Imperial Gift Box | 100ml Crown Flacon + 12ml Royal Attar in handcrafted velvet casket.',
    description: 'Adorned with the emblematic golden eagle stopper, this prestige gift set features 100ml Royal Oud Extrait alongside a 12ml crystal bottle of pure concentrated attar oil. The ultimate luxury statement.',
    price: 14500,
    compare_at_price: 18000,
    stock_quantity: 15,
    sku: 'AM-GIFT-EAGLE',
    image_url: '/images/arabian-eagle.jpg',
    gallery: '["/images/arabian-eagle.jpg"]',
    volume: '100ml + 12ml Attar',
    concentration: 'Extrait de Parfum + Pure Oil',
    gender: 'Unisex',
    top_notes: 'Golden Saffron, Cardamom, Damask Rose',
    heart_notes: 'Cambodian Agarwood, Royal Ambergris',
    base_notes: 'Assam Oud, Dark Musk, Sandalwood',
    longevity: '18+ Hours',
    sillage: 'Regal Sillage',
    is_featured: 1,
    is_sample: 0
  },
  {
    id: 11,
    name: 'Signature Concentrated Attar',
    slug: 'signature-concentrated-attar',
    category_id: 2,
    category_name: 'Royal Oud & Oriental',
    short_description: 'Non-Alcoholic Pure Perfume Oil | 12ml Crystal Flacon with glass dip-wand.',
    description: '100% pure undiluted perfume oil crafted according to classical oriental maceration techniques. Free from alcohol, providing unparalleled closeness, richness, and spiritual warmth.',
    price: 3800,
    compare_at_price: 4900,
    stock_quantity: 30,
    sku: 'AM-ATTAR-12ML',
    image_url: '/images/signature-attar.jpg',
    gallery: '["/images/signature-attar.jpg"]',
    volume: '12ml',
    concentration: '100% Pure Perfume Oil',
    gender: 'Unisex',
    top_notes: 'Amber Nectar, Spiced Rose, White Lily',
    heart_notes: 'Precious Dehn Al Oud, Saffron Thread',
    base_notes: 'Aged Mysore Sandalwood, Black Musk',
    longevity: '24+ Hours',
    sillage: 'Warm & Close to Skin',
    is_featured: 1,
    is_sample: 0
  },
  {
    id: 12,
    name: 'Velvet Rose Body Mist',
    slug: 'velvet-rose-body-mist',
    category_id: 4,
    category_name: 'Sensory Range',
    short_description: 'Hydrating Luxury Fragrance Mist | 250ml. Light, refreshing everyday floral veil.',
    description: 'Enriched with skin-conditioning botanicals, this ultra-fine mist leaves skin delicately perfumed with dewy French roses, peony petals, and a touch of golden amber.',
    price: 1650,
    compare_at_price: 2200,
    stock_quantity: 75,
    sku: 'AM-MIST-ROSE',
    image_url: '/images/body-mist.jpg',
    gallery: '["/images/body-mist.jpg"]',
    volume: '250ml',
    concentration: 'Fragrance Body Mist',
    gender: 'Women',
    top_notes: 'Morning Dew, Lychee, Turkish Rose',
    heart_notes: 'Pink Peony, Water Lily',
    base_notes: 'White Amber, Silken Musk',
    longevity: '6+ Hours',
    sillage: 'Subtle & Fresh',
    is_featured: 0,
    is_sample: 0
  },
  {
    id: 13,
    name: 'Artisan Perfume Wax (Solid Perfume)',
    slug: 'artisan-perfume-wax',
    category_id: 4,
    category_name: 'Sensory Range',
    short_description: 'Pocket Brass Compact | 15g Organic Beeswax & Oud Perfume balm.',
    description: 'Hand-poured into a pocket-sized luxury brass compact. Blend of organic beeswax, golden jojoba oil, and oud extract. Apply to pulse points for subtle, intimate scent release throughout the day.',
    price: 1250,
    compare_at_price: 1600,
    stock_quantity: 60,
    sku: 'AM-WAX-OUD',
    image_url: '/images/perfume-wax.jpg',
    gallery: '["/images/perfume-wax.jpg"]',
    volume: '15g',
    concentration: 'Solid Perfume Wax Balm',
    gender: 'Unisex',
    top_notes: 'Warm Amber, Frankincense',
    heart_notes: 'Cedarwood, Smoky Oud',
    base_notes: 'Beeswax, Jojoba, Soft Musk',
    longevity: '8+ Hours',
    sillage: 'Intimate',
    is_featured: 0,
    is_sample: 0
  },
  {
    id: 14,
    name: 'Imperial Air Care & Linen Diffuser',
    slug: 'imperial-air-care-linen-diffuser',
    category_id: 1,
    category_name: 'Executive Range',
    short_description: 'Home & Office Fragrance | 200ml Amber Glass Flacon + 8 Black Rattan Reeds.',
    description: 'Transform your office or living salon with continuous atmospheric luxury. Notes of aristocratic cedar, bergamot, and golden amber diffuse effortlessly for up to 90 days.',
    price: 2800,
    compare_at_price: 3600,
    stock_quantity: 40,
    sku: 'AM-DIFF-200',
    image_url: '/images/air-care.jpg',
    gallery: '["/images/air-care.jpg"]',
    volume: '200ml',
    concentration: 'Room & Linen Diffuser',
    gender: 'Unisex',
    top_notes: 'Italian Bergamot, Cardamom Spark',
    heart_notes: 'Smoked Cedar, Amber Resin',
    base_notes: 'Haitian Vetiver, Cashmere Musk',
    longevity: '90 Days Ambient Diffusion',
    sillage: 'Room Filling',
    is_featured: 0,
    is_sample: 0
  }
];

export const INITIAL_ORDERS = [
  {
    id: 1,
    order_number: 'AM-2026-1042',
    customer_name: 'Taimoor Ahmed',
    customer_phone: '0300-8472910',
    customer_email: 'taimoor@gmail.com',
    delivery_address: 'House 42-B, Sector F, DHA Phase 5',
    city: 'Lahore',
    postal_code: '54000',
    subtotal: 5000,
    shipping_fee: 0,
    total_amount: 5000,
    status: 'delivered',
    payment_status: 'paid',
    courier_name: 'Trax',
    tracking_number: 'TRX-948201',
    created_at: '2026-10-16 14:20:00',
    items: [
      { id: 1, product_id: 1, product_name: 'Autumn Story', price: 2500, quantity: 2, image_url: '/images/hero.jpg' }
    ]
  },
  {
    id: 2,
    order_number: 'AM-2026-1043',
    customer_name: 'Zara Sheikh',
    customer_phone: '0321-4920194',
    customer_email: 'zara.sheikh@outlook.com',
    delivery_address: 'Apartment 601, Creek Vistas, Phase 8',
    city: 'Karachi',
    postal_code: '75500',
    subtotal: 11500,
    shipping_fee: 0,
    total_amount: 11500,
    status: 'shipped',
    payment_status: 'pending',
    courier_name: 'TCS',
    tracking_number: 'TCS-7839201',
    created_at: '2026-10-17 11:05:00',
    items: [
      { id: 2, product_id: 5, product_name: 'Al Muheet Royal Oud Extrait', price: 11500, quantity: 1, image_url: '/images/royal-oud.jpg' }
    ]
  },
  {
    id: 3,
    order_number: 'AM-2026-1044',
    customer_name: 'Hamza Khan',
    customer_phone: '0333-5192847',
    customer_email: 'hamza.k@gmail.com',
    delivery_address: 'Street 14, Sector F-7/2',
    city: 'Islamabad',
    postal_code: '44000',
    subtotal: 3980,
    shipping_fee: 250,
    total_amount: 4230,
    status: 'confirmed',
    payment_status: 'pending',
    courier_name: 'CallCourier',
    tracking_number: 'CC-401928',
    created_at: '2026-10-17 19:40:00',
    items: [
      { id: 3, product_id: 2, product_name: 'Catch 22', price: 1990, quantity: 2, image_url: '/images/sapphire-smoke.jpg' }
    ]
  }
];

export function getSavedOrders() {
  try {
    const saved = localStorage.getItem('almuheet_demo_orders');
    if (saved) return JSON.parse(saved);
  } catch (e) {
    // Ignore localStorage parse errors
  }
  return INITIAL_ORDERS;
}

export function saveOrders(orders) {
  try {
    localStorage.setItem('almuheet_demo_orders', JSON.stringify(orders));
  } catch (e) {}
}

export function addDemoOrder(orderData) {
  const currentOrders = getSavedOrders();
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const orderNumber = `AM-2026-${randomSuffix}`;

  const resolvedItems = (orderData.items || []).map((it, idx) => {
    const prod = FALLBACK_PRODUCTS.find(p => p.id === it.product_id) || {};
    return {
      id: idx + 1,
      product_id: it.product_id,
      product_name: prod.name || 'Al Muheet Fragrance',
      price: prod.price || 2500,
      quantity: it.quantity || 1,
      image_url: prod.image_url || '/images/hero.jpg'
    };
  });

  const subtotal = resolvedItems.reduce((acc, it) => acc + (it.price * it.quantity), 0);
  const shippingFee = subtotal >= (FALLBACK_SETTINGS.free_shipping_threshold || 6000) ? 0 : 250;
  const totalAmount = subtotal + shippingFee;

  const newOrder = {
    id: Date.now(),
    order_number: orderNumber,
    customer_name: orderData.customer_name || 'Customer',
    customer_phone: orderData.customer_phone || '',
    customer_email: orderData.customer_email || '',
    delivery_address: orderData.delivery_address || '',
    city: orderData.city || 'Lahore',
    postal_code: orderData.postal_code || '',
    order_notes: orderData.order_notes || '',
    subtotal,
    shipping_fee: shippingFee,
    total_amount: totalAmount,
    status: 'pending',
    payment_status: 'pending',
    courier_name: 'TCS',
    tracking_number: '',
    created_at: new Date().toISOString().replace('T', ' ').substring(0, 19),
    items: resolvedItems
  };

  currentOrders.unshift(newOrder);
  saveOrders(currentOrders);
  return newOrder;
}
