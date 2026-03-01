import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { UPLOAD_DIR } from './config/multer.js';

// Routes
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import salesRoutes from './routes/salesRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';
import userRoutes from './routes/userRoutes.js';

const app = express();

// Global Middleware
app.use(cors({ origin: '*', credentials: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Static Files
app.use('/uploads', express.static(UPLOAD_DIR));

// Route Mounts
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/sales', salesRoutes);
app.use('/api', analyticsRoutes); // For /analytics, /audit-logs
app.use('/api/users', userRoutes);
app.use('/api/inventory', productRoutes); // For /inventory/adjust, low-stock (already in productRoutes)

// Health
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

export default app;
