import sqlite3 from 'sqlite3';
import path from 'path';
import fs from 'fs';
import bcrypt from 'bcryptjs';

const DB_DIR = path.resolve('./db');
const DB_PATH = path.join(DB_DIR, 'pos.db');

if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}

sqlite3.verbose();
const db = new sqlite3.Database(DB_PATH);

db.serialize(() => {
  db.run('PRAGMA foreign_keys = ON');
});

export const run = (sql, params = []) =>
  new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) reject(err);
      else resolve(this);
    });
  });

export const get = (sql, params = []) =>
  new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });

export const all = (sql, params = []) =>
  new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });

export async function initDB() {
  await run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL CHECK (role IN ('owner','cashier')),
      failed_attempts INTEGER DEFAULT 0,
      locked_until DATETIME,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
  await run(`
    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      price REAL NOT NULL,
      barcode TEXT UNIQUE NOT NULL,
      category TEXT DEFAULT 'General',
      image TEXT,
      stock INTEGER DEFAULT 0,
      isDeleted INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
  await run(`CREATE TABLE IF NOT EXISTS refresh_tokens (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    token TEXT NOT NULL,
    expires_at DATETIME NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
  )`);
  await run(`CREATE TABLE IF NOT EXISTS password_reset_tokens (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    token TEXT NOT NULL,
    expires_at DATETIME NOT NULL,
    used INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
  )`);
  await run(`
    CREATE TABLE IF NOT EXISTS sales (
      id TEXT PRIMARY KEY,
      date DATETIME NOT NULL,
      subtotal REAL NOT NULL,
      tax REAL NOT NULL,
      total REAL NOT NULL,
      amount_paid REAL NOT NULL,
      change REAL NOT NULL,
      payment_method TEXT DEFAULT 'cash',
      cashier_id INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
  await run(`
    CREATE TABLE IF NOT EXISTS sale_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      sale_id TEXT NOT NULL,
      product_id TEXT NOT NULL,
      name TEXT NOT NULL,
      price REAL NOT NULL,
      quantity INTEGER NOT NULL
    )
  `);
  await run(`
    CREATE TABLE IF NOT EXISTS audit_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      action TEXT NOT NULL,
      details TEXT,
      user_id INTEGER,
      table_name TEXT,
      action_type TEXT,
      old_values TEXT,
      new_values TEXT
    )
  `);

  // Migrations / Backfills
  try {
    const saleCols = await all(`PRAGMA table_info(sales)`);
    const saleColNames = new Set(saleCols.map(c => c.name));
    if (!saleColNames.has('payment_method')) {
      await run(`ALTER TABLE sales ADD COLUMN payment_method TEXT DEFAULT 'cash'`);
    }
  } catch {}
  try {
    const userCols = await all(`PRAGMA table_info(users)`);
    const userColNames = new Set(userCols.map(c => c.name));
    if (!userColNames.has('failed_attempts')) {
      await run(`ALTER TABLE users ADD COLUMN failed_attempts INTEGER DEFAULT 0`);
    }
    if (!userColNames.has('locked_until')) {
      await run(`ALTER TABLE users ADD COLUMN locked_until DATETIME`);
    }
  } catch {}
  try {
    const auditCols = await all(`PRAGMA table_info(audit_logs)`);
    const auditColNames = new Set(auditCols.map(c => c.name));
    if (!auditColNames.has('table_name')) {
      await run(`ALTER TABLE audit_logs ADD COLUMN table_name TEXT`);
    }
    if (!auditColNames.has('action_type')) {
      await run(`ALTER TABLE audit_logs ADD COLUMN action_type TEXT`);
    }
    if (!auditColNames.has('old_values')) {
      await run(`ALTER TABLE audit_logs ADD COLUMN old_values TEXT`);
    }
    if (!auditColNames.has('new_values')) {
      await run(`ALTER TABLE audit_logs ADD COLUMN new_values TEXT`);
    }
  } catch {}

  // Seeding
  const owner = await get(`SELECT * FROM users WHERE role='owner' LIMIT 1`);
  if (!owner) {
    const hash = bcrypt.hashSync('owner123', 12);
    await run(`INSERT INTO users (username, password_hash, role) VALUES (?,?,?)`, ['owner', hash, 'owner']);
    await run(`INSERT INTO audit_logs (action, details) VALUES (?,?)`, ['SEED_OWNER', 'Created default owner account (username: owner, password: owner123)']);
  }

  const count = await get(`SELECT COUNT(*) as c FROM products`);
  if (!count || count.c === 0) {
    const seedProducts = [
      { id: 'P001', name: 'White Bread', price: 50, barcode: 'WB001', category: 'Bakery', stock: 30 },
      { id: 'P002', name: 'Milk', price: 80, barcode: 'MLK001', category: 'Dairy', stock: 25 },
      { id: 'P003', name: 'Eggs (Dozen)', price: 120, barcode: 'EGG012', category: 'Poultry', stock: 40 },
      { id: 'P004', name: 'Sugar 1kg', price: 70, barcode: 'SGR1KG', category: 'Grocery', stock: 50 },
      { id: 'P005', name: 'Coffee 200g', price: 150, barcode: 'CFE200', category: 'Beverages', stock: 20 },
      { id: 'P006', name: 'Soap Bar', price: 25, barcode: 'SPB001', category: 'Personal Care', stock: 60 },
      { id: 'P007', name: 'Rice 1kg', price: 60, barcode: 'RCE1KG', category: 'Grocery', stock: 80 },
      { id: 'P008', name: 'Softdrink 1L', price: 55, barcode: 'SFT1L', category: 'Beverages', stock: 35 },
    ];
    for (const p of seedProducts) {
      await run(`INSERT INTO products (id, name, price, barcode, category, stock, isDeleted) VALUES (?,?,?,?,?,?,0)`, [p.id, p.name, p.price, p.barcode, p.category, p.stock]);
    }
    await run(`INSERT INTO audit_logs (action, details) VALUES (?,?)`, ['SEED_PRODUCTS', 'Inserted 8 test products']);
  }
}

export default db;
