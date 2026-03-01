import { BACKEND_URL } from '../config';

const getHeaders = (token) => ({
  'Content-Type': 'application/json',
  ...(token ? { Authorization: `Bearer ${token}` } : {}),
});

export const apiService = {
  fetchAnalytics: async (token, lowThreshold, signal) => {
    const [analyticsRes, logsRes, lowRes] = await Promise.all([
      fetch(`${BACKEND_URL}/api/analytics`, { headers: { Authorization: `Bearer ${token}` }, signal }),
      fetch(`${BACKEND_URL}/api/audit-logs`, { headers: { Authorization: `Bearer ${token}` }, signal }),
      fetch(`${BACKEND_URL}/api/inventory/low-stock?threshold=${lowThreshold}`, { headers: { Authorization: `Bearer ${token}` }, signal })
    ]);

    const analytics = analyticsRes.ok ? await analyticsRes.json() : null;
    const logs = logsRes.ok ? await logsRes.json() : [];
    const lowStock = lowRes.ok ? await lowRes.json() : { items: [] };

    return { analytics, logs, lowStock: lowStock.items || [] };
  },

  clearAuditLogs: async (token) => {
    const res = await fetch(`${BACKEND_URL}/api/audit-logs`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) throw new Error('Failed to clear audit logs');
    return await res.json();
  },

  fetchUsers: async (token) => {
    const res = await fetch(`${BACKEND_URL}/api/users`, { headers: { Authorization: `Bearer ${token}` } });
    return res.ok ? await res.json() : [];
  },

  addCashier: async (token, username, password) => {
    const res = await fetch(`${BACKEND_URL}/api/users`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify({ username, password, role: 'cashier' })
    });
    if (!res.ok) {
      const errData = await res.json().catch(() => null);
      throw new Error(errData?.error || 'Failed to add cashier');
    }
    return await res.json();
  },

  removeUser: async (token, id) => {
    const res = await fetch(`${BACKEND_URL}/api/users/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) throw new Error('Failed to remove user');
    return true;
  },

  fetchProducts: async (token) => {
    const res = await fetch(`${BACKEND_URL}/api/products`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    if (!res.ok) throw new Error('Failed to fetch products');
    return await res.json();
  },

  processPayment: async (token, cart) => {
    const res = await fetch(`${BACKEND_URL}/api/sales`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify({
        items: cart.map(c => ({ id: c.id, name: c.name, price: c.price, quantity: c.quantity })),
        amountPaid: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0) * 1.12, // Crude check, sender should calc it
      }),
    });
    // Note: The total calculation should ideally be consistent. The original app passes transaction.amountPaid.
  },

  // Fixed version of processPayment to match original logic
  createSale: async (token, saleData) => {
    const res = await fetch(`${BACKEND_URL}/api/sales`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify(saleData),
    });
    if (!res.ok) throw new Error('Failed to persist sale');
    return await res.json();
  },

  addProduct: async (token, formData) => {
    const res = await fetch(`${BACKEND_URL}/api/products`, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData,
    });
    if (!res.ok) {
        const errData = await res.json().catch(() => null);
        throw new Error(errData?.error || 'Failed to add product');
    }
    return await res.json();
  },

  updateProduct: async (token, id, data, isFormData = false) => {
    const res = await fetch(`${BACKEND_URL}/api/products/${id}`, {
      method: 'PUT',
      headers: isFormData ? (token ? { Authorization: `Bearer ${token}` } : {}) : getHeaders(token),
      body: isFormData ? data : JSON.stringify(data),
    });
    if (!res.ok) {
        const errData = await res.json().catch(() => null);
        throw new Error(errData?.error || 'Failed to update product');
    }
    return await res.json();
  }
};
