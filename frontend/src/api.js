// ==========================================================
// Al Muheet Fragrance - API Client
// Handles REST calls, JWT authentication headers, and asset URLs
// Includes graceful fallback for Vercel static demo preview
// ==========================================================

import { 
  FALLBACK_SETTINGS, 
  FALLBACK_CATEGORIES, 
  FALLBACK_PRODUCTS, 
  getSavedOrders, 
  saveOrders, 
  addDemoOrder 
} from './fallbackData';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

export function getApiBase() {
  return API_BASE;
}

export function getAssetUrl(path) {
  if (!path) return '/images/royal-oud.jpg';
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  // If uploaded to backend (/uploads/...) and we are in dev where frontend is on :5173
  if (path.startsWith('/uploads/')) {
    const backendRoot = API_BASE.replace(/\/api\/?$/, '');
    return `${backendRoot}${path}`;
  }
  return path;
}

function getFallbackData(endpoint, options = {}) {
  const method = (options.method || 'GET').toUpperCase();
  const [path, queryString] = endpoint.split('?');
  const params = new URLSearchParams(queryString || '');

  // 1. Settings
  if (path === '/settings' || path === 'settings') {
    return { status: 'success', data: FALLBACK_SETTINGS };
  }

  // 2. Categories
  if (path === '/categories' || path === 'categories') {
    return { status: 'success', data: FALLBACK_CATEGORIES };
  }

  // 3. Products
  if (path === '/products' || path === 'products') {
    let prods = [...FALLBACK_PRODUCTS];
    try {
      const extra = localStorage.getItem('almuheet_demo_custom_products');
      if (extra) {
        prods = [...JSON.parse(extra), ...prods];
      }
    } catch (e) {}

    const search = params.get('search');
    const categoryId = params.get('category_id');

    if (search) {
      const q = search.toLowerCase();
      prods = prods.filter(p => p.name?.toLowerCase().includes(q) || p.description?.toLowerCase().includes(q));
    }
    if (categoryId) {
      prods = prods.filter(p => String(p.category_id) === String(categoryId));
    }
    return { status: 'success', data: prods, total: prods.length };
  }

  // 4. Single Product
  if (path.startsWith('/products/')) {
    const idOrSlug = path.replace('/products/', '');
    let prods = [...FALLBACK_PRODUCTS];
    try {
      const extra = localStorage.getItem('almuheet_demo_custom_products');
      if (extra) prods = [...JSON.parse(extra), ...prods];
    } catch (e) {}
    const found = prods.find(p => String(p.id) === idOrSlug || p.slug === idOrSlug) || prods[0];
    return { status: 'success', data: found };
  }

  // 5. Orders - Track
  if (path === '/orders/track') {
    const orderNum = params.get('order_number') || params.get('phone');
    const orders = getSavedOrders();
    const found = orders.find(o => o.order_number === orderNum || o.customer_phone === orderNum) || orders[0];
    return { status: 'success', data: found };
  }

  // 6. Orders - POST (Place COD Order)
  if ((path === '/orders' || path === 'orders') && method === 'POST') {
    let body = {};
    try {
      body = typeof options.body === 'string' ? JSON.parse(options.body) : (options.body || {});
    } catch (e) {}
    const newOrder = addDemoOrder(body);
    return { status: 'success', message: 'Order created successfully', data: newOrder };
  }

  // 7. Orders - GET List
  if ((path === '/orders' || path === 'orders') && method === 'GET') {
    const orders = getSavedOrders();
    return { status: 'success', data: orders, total: orders.length };
  }

  // 8. Orders - GET Single or PUT Update
  if (path.startsWith('/orders/')) {
    const orderId = path.replace('/orders/', '');
    const orders = getSavedOrders();
    const idx = orders.findIndex(o => String(o.id) === orderId || o.order_number === orderId);
    if (method === 'PUT') {
      let body = {};
      try {
        body = typeof options.body === 'string' ? JSON.parse(options.body) : (options.body || {});
      } catch (e) {}
      if (idx !== -1) {
        orders[idx] = { ...orders[idx], ...body };
        saveOrders(orders);
        return { status: 'success', message: 'Order updated', data: orders[idx] };
      }
    }
    const found = idx !== -1 ? orders[idx] : orders[0];
    return { status: 'success', data: found };
  }

  // 9. Auth
  if (path === '/auth/login' && method === 'POST') {
    return {
      status: 'success',
      data: {
        token: 'demo_jwt_token_almuheet_preview',
        admin: { name: 'Store Administrator', email: 'admin@almuheet.store', role: 'superadmin' }
      },
      token: 'demo_jwt_token_almuheet_preview',
      admin: { name: 'Store Administrator', email: 'admin@almuheet.store', role: 'superadmin' }
    };
  }
  if (path === '/auth/me') {
    return {
      status: 'success',
      data: { name: 'Store Administrator', email: 'admin@almuheet.store', role: 'superadmin' }
    };
  }

  // 10. Analytics
  if (path === '/analytics') {
    const orders = getSavedOrders();
    const totalSales = orders.reduce((sum, o) => sum + (o.total_amount || 0), 0);
    return {
      status: 'success',
      data: {
        total_sales: totalSales || 24710,
        total_orders: orders.length || 3,
        average_order_value: orders.length ? Math.round(totalSales / orders.length) : 8236,
        conversion_rate: 3.4,
        recent_sales: [
          { date: '10/12', sales: 4990 },
          { date: '10/13', sales: 7500 },
          { date: '10/14', sales: 11500 },
          { date: '10/15', sales: 8900 },
          { date: '10/16', sales: 14500 },
          { date: '10/17', sales: 16500 },
          { date: '10/18', sales: 24710 }
        ],
        top_products: [
          { name: 'Autumn Story', sales_count: 34, revenue: 85000 },
          { name: 'Catch 22', sales_count: 28, revenue: 55720 },
          { name: 'Al Muheet Royal Oud Extrait', sales_count: 14, revenue: 161000 },
          { name: 'Discovery Tester Vault', sales_count: 21, revenue: 67200 }
        ],
        cities: [
          { city: 'Lahore', percentage: 48, orders: 18 },
          { city: 'Karachi', percentage: 32, orders: 12 },
          { city: 'Islamabad', percentage: 20, orders: 8 }
        ]
      }
    };
  }

  // 11. Customers
  if (path === '/customers') {
    const orders = getSavedOrders();
    const customers = orders.map((o, idx) => ({
      id: idx + 1,
      name: o.customer_name,
      phone: o.customer_phone,
      email: o.customer_email || 'customer@gmail.com',
      city: o.city,
      total_spent: o.total_amount,
      orders_count: 1
    }));
    return { status: 'success', data: customers, total: customers.length };
  }

  // 12. Add Product POST
  if ((path === '/products' || path === 'products') && method === 'POST') {
    let body = {};
    try {
      body = typeof options.body === 'string' ? JSON.parse(options.body) : (options.body || {});
    } catch (e) {}
    const newProd = {
      id: Date.now(),
      ...body,
      is_sample: 0
    };
    try {
      const extra = localStorage.getItem('almuheet_demo_custom_products');
      const list = extra ? JSON.parse(extra) : [];
      list.unshift(newProd);
      localStorage.setItem('almuheet_demo_custom_products', JSON.stringify(list));
    } catch (e) {}
    return { status: 'success', message: 'Product created successfully', data: newProd };
  }

  return null;
}

async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
  
  const headers = {
    'Accept': 'application/json',
    ...(options.headers || {})
  };

  // Attach JWT Bearer token if available
  const token = localStorage.getItem('almuheet_admin_token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Set Content-Type to JSON unless sending FormData
  if (!(options.body instanceof FormData) && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const response = await fetch(url, {
      ...options,
      headers,
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const errorMsg = data?.message || `Request failed with status ${response.status}`;
      const err = new Error(errorMsg);
      err.status = response.status;
      err.data = data;
      throw err;
    }

    return data;
  } catch (error) {
    // If backend server is offline (e.g., deployed on Vercel preview without live backend),
    // gracefully fall back to rich client-side store data so customer can test everything!
    const fallback = getFallbackData(endpoint, options);
    if (fallback !== null) {
      console.info(`[Al Muheet] Serving preview fallback data for: ${options.method || 'GET'} ${endpoint}`);
      return fallback;
    }

    console.error(`API Error [${options.method || 'GET'} ${endpoint}]:`, error);
    throw error;
  }
}

export const api = {
  get: (endpoint, params = {}) => {
    const queryString = new URLSearchParams(
      Object.entries(params).filter(([_, v]) => v !== undefined && v !== null && v !== '')
    ).toString();
    const fullEndpoint = queryString ? `${endpoint}?${queryString}` : endpoint;
    return request(fullEndpoint, { method: 'GET' });
  },

  post: (endpoint, data = {}) => {
    return request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  put: (endpoint, data = {}) => {
    return request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  },

  delete: (endpoint) => {
    return request(endpoint, { method: 'DELETE' });
  },

  upload: (file) => {
    const formData = new FormData();
    formData.append('image', file);
    return request('/upload', {
      method: 'POST',
      body: formData
    });
  }
};

export default api;
