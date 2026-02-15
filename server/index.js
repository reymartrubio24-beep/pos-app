const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
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
  
  // Generate ID
  db.get("SELECT id FROM products ORDER BY id DESC LIMIT 1", (err, rowLast) => {
      let newId = 'P001';
      if (rowLast && rowLast.id.startsWith('P')) {
            const lastNumStr = rowLast.id.substring(1);
            if (!isNaN(lastNumStr)) {
                const lastNum = parseInt(lastNumStr);
                newId = `P${String(lastNum + 1).padStart(3, '0')}`;
            } else {
                 newId = `P${Date.now()}`; // Fallback
            }
      } else if (rowLast) {
          // If ID format is different, fallback
           newId = `P${Date.now()}`;
      }
      
      const sql = "INSERT INTO products (id, name, price, barcode, category, image, isDeleted) VALUES (?, ?, ?, ?, ?, ?, 0)";
      const params = [newId, name, parseFloat(price), barcode, category, image];
      
      db.run(sql, params, function(err) {
        if (err) {
          res.status(400).json({ error: err.message });
          return;
        }
        res.json({
          id: newId,
          name,
          price: parseFloat(price),
          barcode,
          category,
          image,
          isDeleted: false
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
