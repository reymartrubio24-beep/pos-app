const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const db = require('./db');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(bodyParser.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)){
    fs.mkdirSync(uploadsDir);
}

// Multer storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, uniqueSuffix + path.extname(file.originalname)) // Append extension
  }
})

const upload = multer({ storage: storage });

// API Endpoints

// Get all products
app.get('/api/products', (req, res) => {
  db.all("SELECT * FROM products", [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    const products = rows.map(p => ({
      ...p,
      isDeleted: !!p.isDeleted
    }));
    res.json(products);
  });
});

// Add new product
app.post('/api/products', upload.single('image'), (req, res) => {
  const { name, price, barcode, category } = req.body;
  const image = req.file ? `http://localhost:${PORT}/uploads/${req.file.filename}` : null;
  
  // Server-side validation
  const numericPrice = parseFloat(price);
  if (!name || isNaN(numericPrice) || numericPrice < 0) {
    return res.status(400).json({ error: "Invalid product data: name and a non-negative numeric price are required." });
  }
  if (!barcode) {
    return res.status(400).json({ error: "Barcode is required." });
  }
  
  // Prevent duplicate barcode entries
  db.get("SELECT id FROM products WHERE barcode = ?", [barcode], (dupErr, dupRow) => {
    if (dupErr) {
      return res.status(500).json({ error: dupErr.message });
    }
    if (dupRow) {
      return res.status(409).json({ error: "A product with this barcode already exists." });
    }
    
    // Generate next ID using numeric ordering of the suffix to avoid lexicographic issues
    const lastIdSql = "SELECT id FROM products WHERE id LIKE 'P%' ORDER BY CAST(SUBSTR(id, 2) AS INTEGER) DESC LIMIT 1";
    db.get(lastIdSql, (err, rowLast) => {
      let newId = 'P001';
      if (rowLast && typeof rowLast.id === 'string' && rowLast.id.startsWith('P')) {
        const lastNumStr = rowLast.id.substring(1);
        const lastNum = parseInt(lastNumStr, 10);
        if (!isNaN(lastNum)) {
          const nextNum = lastNum + 1;
          const width = Math.max(lastNumStr.length, 3);
          newId = `P${String(nextNum).padStart(width, '0')}`;
        } else {
          newId = `P${Date.now()}`;
        }
      } else if (rowLast) {
        newId = `P${Date.now()}`;
      }
      
      const sql = "INSERT INTO products (id, name, price, barcode, category, image, isDeleted) VALUES (?, ?, ?, ?, ?, ?, 0)";
      const params = [newId, name, numericPrice, barcode, category, image];
      
      db.run(sql, params, function(insertErr) {
        if (insertErr) {
          return res.status(400).json({ error: insertErr.message });
        }
        res.json({
          id: newId,
          name,
          price: numericPrice,
          barcode,
          category,
          image,
          isDeleted: false
        });
      });
    });
  });
});

// Update product (including soft delete)
app.put('/api/products/:id', upload.single('image'), (req, res) => {
    const { id } = req.params;
    const { name, price, barcode, category, isDeleted } = req.body;
    let image = req.body.image; // Could be existing URL string or null

    if (req.file) {
        image = `http://localhost:${PORT}/uploads/${req.file.filename}`;
    }

    let sql = "UPDATE products SET ";
    const params = [];
    const updates = [];
    
    if (name !== undefined) { updates.push("name = ?"); params.push(name); }
    if (price !== undefined) { updates.push("price = ?"); params.push(parseFloat(price)); }
    if (barcode !== undefined) { updates.push("barcode = ?"); params.push(barcode); }
    if (category !== undefined) { updates.push("category = ?"); params.push(category); }
    if (image !== undefined) { updates.push("image = ?"); params.push(image); }
    if (isDeleted !== undefined) { updates.push("isDeleted = ?"); params.push(isDeleted === 'true' || isDeleted === true || isDeleted === '1' ? 1 : 0); }

    if (updates.length === 0) {
        return res.status(400).json({ error: "No fields to update" });
    }
    
    sql += updates.join(", ") + " WHERE id = ?";
    params.push(id);
    
    db.run(sql, params, function(err) {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        
        db.get("SELECT * FROM products WHERE id = ?", [id], (err, row) => {
            if (err) {
                 res.status(500).json({ error: err.message });
                 return;
            }
            if (!row) {
                 res.status(404).json({ error: "Product not found" });
                 return;
            }
             res.json({
                ...row,
                isDeleted: !!row.isDeleted
             });
        });
    });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
