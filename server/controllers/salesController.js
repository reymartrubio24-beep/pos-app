import { run, get, all } from '../config/db.js';

export const createSale = async (req, res) => {
  const { items = [], amountPaid, paymentMethod = 'cash' } = req.body || {};
  if (!Array.isArray(items) || items.length === 0) return res.status(400).json({ error: 'No items' });
  const subtotal = items.reduce((s, it) => s + it.price * it.quantity, 0);
  const tax = +(subtotal * 0.12).toFixed(2);
  const total = +(subtotal + tax).toFixed(2);
  if (amountPaid == null || parseFloat(amountPaid) < total) return res.status(400).json({ error: 'Insufficient payment' });
  const change = +(parseFloat(amountPaid) - total).toFixed(2);

  const id = `TXN${Date.now()}`;
  const date = new Date().toISOString();
  try {
    await run('BEGIN TRANSACTION');
    await run(
      `INSERT INTO sales (id, date, subtotal, tax, total, amount_paid, change, payment_method, cashier_id) VALUES (?,?,?,?,?,?,?,?,?)`,
      [id, date, subtotal, tax, total, parseFloat(amountPaid), change, paymentMethod, req.user.id]
    );
    for (const it of items) {
      const before = await get(`SELECT stock FROM products WHERE id=?`, [it.id]);
      const afterStock = (before?.stock || 0) - it.quantity;
      if (afterStock < 0) {
        await run('ROLLBACK');
        return res.status(400).json({ error: `Insufficient stock for ${it.name}` });
      }
      await run(`INSERT INTO sale_items (sale_id, product_id, name, price, quantity) VALUES (?,?,?,?,?)`, [id, it.id, it.name, it.price, it.quantity]);
      await run(`UPDATE products SET stock = ? WHERE id = ?`, [afterStock, it.id]);
      await run(`INSERT INTO audit_logs (action, details, user_id, table_name, action_type, old_values, new_values) VALUES (?,?,?,?,?,?,?)`, [
        'STOCK_DEDUCT', `Deducted ${it.quantity} from ${it.id}`, req.user.id, 'products', 'UPDATE',
        JSON.stringify({ stock: before?.stock }), JSON.stringify({ stock: afterStock })
      ]);
    }
    await run('COMMIT');
    await run(`INSERT INTO audit_logs (action, details, user_id) VALUES (?,?,?)`, ['SALE_CREATE', `Sale ${id} by ${req.user.username} (${items.length} items)`, req.user.id]);
    res.json({ id, date, subtotal, tax, total, amountPaid: parseFloat(amountPaid), change, items });
  } catch (e) {
    await run('ROLLBACK').catch(() => {});
    console.error('Sale error:', e);
    res.status(500).json({ error: 'Process sale failed' });
  }
};

export const getSales = async (req, res) => {
  const sales = await all(`SELECT * FROM sales ORDER BY date DESC LIMIT 200`);
  res.json(sales);
};

export const getAnalytics = async (req, res) => {
  const daily = await get(`SELECT IFNULL(SUM(total),0) as total FROM sales WHERE DATE(date) = DATE('now')`);
  const weekly = await get(`SELECT IFNULL(SUM(total),0) as total FROM sales WHERE date >= datetime('now', '-7 days')`);
  const monthly = await get(`SELECT IFNULL(SUM(total),0) as total FROM sales WHERE strftime('%Y-%m', date) = strftime('%Y-%m', 'now')`);
  const topProducts = await all(`
    SELECT si.product_id, si.name, SUM(si.quantity) as qty, SUM(si.price*si.quantity) as revenue
    FROM sale_items si
    GROUP BY si.product_id, si.name
    ORDER BY qty DESC, revenue DESC
    LIMIT 10
  `);
  const monthlySeries = await all(`
    SELECT strftime('%Y-%m', date) as month, SUM(total) as revenue, COUNT(*) as txns
    FROM sales
    GROUP BY month
    ORDER BY month ASC
  `);
  res.json({ daily: daily.total, weekly: weekly.total, monthly: monthly.total, topProducts, monthlySeries });
};

export const getAuditLogs = async (req, res) => {
  const logs = await all(`SELECT * FROM audit_logs ORDER BY timestamp DESC LIMIT 500`);
  res.json(logs);
};
