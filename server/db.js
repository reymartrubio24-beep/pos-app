const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'pos.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database ' + dbPath + ': ' + err.message);
  } else {
    console.log('Connected to the SQLite database.');
  }
});

const initialProducts = [
  { id: 'P001', name: 'White Bread', price: 45.00, barcode: '8801234567890', category: 'Bakery', image: null, isDeleted: 0 },
  { id: 'P002', name: 'Coca-Cola 1.5L', price: 85.00, barcode: '8801234567891', category: 'Beverages', image: null, isDeleted: 0 },
  { id: 'P003', name: 'Marlboro Red', price: 165.00, barcode: '8801234567892', category: 'Tobacco', image: null, isDeleted: 0 },
  { id: 'P004', name: 'Lucky Me Pancit Canton', price: 15.00, barcode: '8801234567893', category: 'Instant Noodles', image: null, isDeleted: 0 },
  { id: 'P005', name: 'San Miguel Pale Pilsen', price: 55.00, barcode: '8801234567894', category: 'Beverages', image: null, isDeleted: 0 },
  { id: 'P006', name: 'Safeguard Soap', price: 35.00, barcode: '8801234567895', category: 'Personal Care', image: null, isDeleted: 0 },
  { id: 'P007', name: 'Alaska Evaporated Milk', price: 28.00, barcode: '8801234567896', category: 'Dairy', image: null, isDeleted: 0 },
  { id: 'P008', name: 'Century Tuna', price: 32.00, barcode: '8801234567897', category: 'Canned Goods', image: null, isDeleted: 0 },
  { id: 'P009', name: 'Piattos Cheese', price: 25.00, barcode: '8801234567898', category: 'Snacks', image: null, isDeleted: 0 },
  { id: 'P010', name: 'Colgate Toothpaste', price: 48.00, barcode: '8801234567899', category: 'Personal Care', image: null, isDeleted: 0 },
];

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS products (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    price REAL NOT NULL,
    barcode TEXT,
    category TEXT,
    image TEXT,
    isDeleted INTEGER DEFAULT 0
  )`);

  db.get("SELECT count(*) as count FROM products", (err, row) => {
    if (err) {
      console.error(err.message);
    } else if (row.count === 0) {
      console.log('Seeding database with initial products...');
      const stmt = db.prepare("INSERT INTO products (id, name, price, barcode, category, image, isDeleted) VALUES (?, ?, ?, ?, ?, ?, ?)");
      initialProducts.forEach(product => {
        stmt.run(product.id, product.name, product.price, product.barcode, product.category, product.image, product.isDeleted);
      });
      stmt.finalize();
    }
  });
});

module.exports = db;
