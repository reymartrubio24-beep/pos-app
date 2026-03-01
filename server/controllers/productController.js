import { run, get, all } from '../config/db.js';

async function generateProductId() {
  const last = await get(`SELECT id FROM products ORDER BY id DESC LIMIT 1`);
  if (!last) return 'P001';
  const n = parseInt(last.id.replace('P', ''), 10) + 1;
  return `P${String(n).padStart(3, '0')}`;
}

export const getProducts = async (req, res) => {
  const products = await all(`SELECT * FROM products WHERE isDeleted=0 ORDER BY id`);
  res.json(products);
};

export const createProduct = async (req, res) => {
  try {
    const { name, price, barcode, category = 'General', stock } = req.body || {};
    if (!name || !price || !barcode) return res.status(400).json({ error: 'Missing fields' });
    const id = await generateProductId();
    const image = req.file ? `/uploads/${req.file.filename}` : null;
    await run(
      `INSERT INTO products (id, name, price, barcode, category, image, stock, isDeleted) VALUES (?,?,?,?,?,?,?,0)`,
      [id, name, parseFloat(price), barcode, category, image, stock != null ? parseInt(stock, 10) : 0]
    );
    await run(`INSERT INTO audit_logs (action, details, user_id) VALUES (?,?,?)`, ['PRODUCT_CREATE', `Added product ${name} (${id})`, req.user.id]);
    const product = await get(`SELECT * FROM products WHERE id=?`, [id]);
    res.json(product);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

export const updateProduct = async (req, res) => {
  const { id } = req.params;
  const existing = await get(`SELECT * FROM products WHERE id=?`, [id]);
  if (!existing) return res.status(404).json({ error: 'Product not found' });

  let fields = {};
  if (req.is('application/json')) {
    fields = req.body || {};
  } else if (req.file) {
    fields.image = `/uploads/${req.file.filename}`;
  }

  const updates = [];
  const params = [];
  for (const [key, val] of Object.entries(fields)) {
    if (['name', 'price', 'barcode', 'category', 'image', 'stock', 'isDeleted'].includes(key)) {
      updates.push(`${key} = ?`);
      params.push(key === 'price' ? parseFloat(val) : key === 'stock' ? parseInt(val, 10) : val);
    }
  }
  updates.push(`updated_at = CURRENT_TIMESTAMP`);
  const sql = `UPDATE products SET ${updates.join(', ')} WHERE id = ?`;
  params.push(id);
  await run(sql, params);

  await run(`INSERT INTO audit_logs (action, details, user_id) VALUES (?,?,?)`, [
    updates.includes('isDeleted = ?') && fields.isDeleted ? 'PRODUCT_DELETE' : req.file ? 'IMAGE_UPDATE' : 'PRODUCT_UPDATE',
    req.file ? `Updated image for product: ${existing.name} (${id})` : `Updated product ${existing.name} (${id})`,
    req.user.id,
  ]);
  const product = await get(`SELECT * FROM products WHERE id=?`, [id]);
  res.json(product);
};

export const adjustInventory = async (req, res) => {
  const { productId, delta, reason } = req.body || {};
  if (!productId || !delta || !reason) return res.status(400).json({ error: 'Missing fields' });
  const before = await get(`SELECT stock FROM products WHERE id=?`, [productId]);
  if (!before) return res.status(404).json({ error: 'Product not found' });
  const afterStock = (before.stock || 0) + parseInt(delta, 10);
  if (afterStock < 0) return res.status(400).json({ error: 'Stock cannot be negative' });
  await run(`UPDATE products SET stock=? WHERE id=?`, [afterStock, productId]);
  await run(`INSERT INTO audit_logs (action, details, user_id, table_name, action_type, old_values, new_values) VALUES (?,?,?,?,?,?,?)`, [
    'INVENTORY_ADJUST', `Adjust ${productId} by ${delta}. Reason: ${reason}`, req.user.id, 'products', 'UPDATE',
    JSON.stringify({ stock: before.stock }), JSON.stringify({ stock: afterStock })
  ]);
  res.json({ productId, stock: afterStock });
};

export const getLowStock = async (req, res) => {
  const threshold = parseInt(req.query.threshold || '10', 10);
  const items = await all(`SELECT * FROM products WHERE isDeleted=0 AND stock <= ? ORDER BY stock ASC`, [threshold]);
  res.json({ threshold, items });
};
