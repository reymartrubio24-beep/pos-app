import React, { useState, useEffect, useRef } from 'react';
import { ShoppingCart, BarChart3, Package, User, Sun, Moon, Clock, X } from 'lucide-react';
import { Chart as ChartJS, LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend } from 'chart.js';

// Configuration & Utils
import { BACKEND_URL } from './config';
import { getImageUrl } from './utils/formatters';
import { apiService } from './services/apiService';

// Components
import Footer from './components/Footer';
import ErrorBoundary from './components/shared/ErrorBoundary';
import LoginForm from './components/auth/LoginForm';
import POSView from './components/pos/POSView';
import SalesMonitoringView from './components/sales/SalesMonitoringView';
import ProductManagementView from './components/inventory/ProductManagementView';
import UsersManagementView from './components/users/UsersManagementView';
import DeleteModal from './components/modals/DeleteModal';
import ImageUploadModal from './components/modals/ImageUploadModal';
import ReceiptModal from './components/modals/ReceiptModal';
import EditProductModal from './components/modals/EditProductModal';

// Register ChartJS
ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend);

const POSSystem = () => {
  // --- State Management ---
  const [activeView, setActiveView] = useState('pos');
  const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem('darkMode') === 'true');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [auth, setAuth] = useState(() => {
    const token = localStorage.getItem('token') || null;
    const role = localStorage.getItem('role') || null;
    const username = localStorage.getItem('username') || null;
    return { token, role, username };
  });
  const [loginModalOpen, setLoginModalOpen] = useState(false);

  // Sales Monitoring / Analytics State
  const [serverAnalytics, setServerAnalytics] = useState(null);
  const [serverAuditLogs, setServerAuditLogs] = useState([]);
  const [lowStockItems, setLowStockItems] = useState([]);
  const [lowThreshold, setLowThreshold] = useState(10);

  // Users Management State
  const [users, setUsers] = useState([]);
  const newUserUsernameRef = useRef('');
  const newUserPasswordRef = useRef('');

  // Cart & Transaction State
  const [cart, setCart] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [amountPaid, setAmountPaid] = useState('');
  const [transactions, setTransactions] = useState([]);
  const [showReceipt, setShowReceipt] = useState(false);
  const [currentReceipt, setCurrentReceipt] = useState(null);
  const [auditLogs, setAuditLogs] = useState([]);

  // Modal States
  const [deleteConfirmation, setDeleteConfirmation] = useState({ open: false, product: null });
  const [editImageModal, setEditImageModal] = useState({ open: false, product: null, preview: null });
  const [editProductModal, setEditProductModal] = useState({ open: false, product: null });

  // New Product Form State
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    barcode: '',
    category: '',
    image: null,
    stock: ''
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  // --- Effects ---

  // Dark Mode
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', isDarkMode);
  }, [isDarkMode]);

  // Fetch Products
  const fetchProducts = async () => {
    try {
      const data = await apiService.fetchProducts(auth.token);
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [auth.token]);

  // Fetch Analytics & Users (Owner Only)
  useEffect(() => {
    const ctrl = new AbortController();
    const fetchData = async () => {
      if (auth.role === 'owner' && auth.token) {
        try {
          const { analytics, logs, lowStock } = await apiService.fetchAnalytics(auth.token, lowThreshold, ctrl.signal);
          setServerAnalytics(analytics);
          setServerAuditLogs(logs);
          setLowStockItems(lowStock);

          const usersData = await apiService.fetchUsers(auth.token);
          setUsers(usersData);
        } catch (e) {
          if (!ctrl.signal.aborted) console.error('Error fetching dashboard data', e);
        }
      }
    };
    fetchData();
    return () => ctrl.abort();
  }, [auth.role, auth.token, lowThreshold]);

  // --- Actions ---

  const logAction = (action, details) => {
    const log = {
      id: `LOG${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      action,
      details
    };
    setAuditLogs(prev => [log, ...prev]);
  };

  const addToCart = (product) => {
    if (product.stock <= 0) {
      alert('This item is currently sold out.');
      return;
    }

    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
      if (existingItem.quantity >= product.stock) {
        alert(`Only ${product.stock} units available in stock.`);
        return;
      }
      setCart(cart.map(item =>
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const updateQuantity = (id, delta) => {
    setCart(cart.map(item => {
      if (item.id === id) {
        const product = products.find(p => p.id === id);
        const newQty = item.quantity + delta;
        if (delta > 0 && product && newQty > product.stock) {
          alert(`Only ${product.stock} units available in stock.`);
          return item;
        }
        return { ...item, quantity: Math.max(1, newQty) };
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const removeFromCart = (id) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const calculateTotals = () => {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * 0.12;
    const total = subtotal + tax;
    const change = amountPaid ? parseFloat(amountPaid) - total : 0;
    return { subtotal, tax, total, change };
  };

  const { subtotal, tax, total, change } = calculateTotals();

  const processPayment = async () => {
    if (cart.length === 0) { alert('Cart is empty!'); return; }
    if (!amountPaid || parseFloat(amountPaid) < total) { alert('Insufficient payment amount!'); return; }

    const transaction = {
      id: `TXN${Date.now()}`,
      date: new Date(),
      items: [...cart],
      subtotal, tax, total,
      amountPaid: parseFloat(amountPaid),
      change
    };

    try {
      if (auth.token) {
        const persisted = await apiService.createSale(auth.token, {
          items: cart.map(c => ({ id: c.id, name: c.name, price: c.price, quantity: c.quantity })),
          amountPaid: transaction.amountPaid,
        });
        transaction.id = persisted.id;
        transaction.date = new Date(persisted.date);
        fetchProducts();
      }
    } catch (e) {
      console.error('Error persisting sale:', e);
    }

    setTransactions([transaction, ...transactions]);
    setCurrentReceipt(transaction);
    setShowReceipt(true);
    setCart([]);
    setAmountPaid('');
  };

  const addNewProduct = async () => {
    if (auth.role !== 'owner') { setLoginModalOpen(true); return; }
    if (!newProduct.name || !newProduct.price || !newProduct.barcode) { alert('Please fill in all required fields'); return; }

    try {
      const formData = new FormData();
      formData.append('name', newProduct.name);
      formData.append('price', parseFloat(newProduct.price).toString());
      formData.append('barcode', newProduct.barcode);
      formData.append('category', newProduct.category || 'General');
      if (newProduct.stock) formData.append('stock', newProduct.stock);
      if (newProduct.imageFile) formData.append('image', newProduct.imageFile);

      const product = await apiService.addProduct(auth.token, formData);
      setProducts([...products, product]);
      setNewProduct({ name: '', price: '', barcode: '', category: '', image: null, imageFile: null, stock: '' });
      setImagePreview(null);
      alert('Product added successfully!');
    } catch (error) {
      alert(`Error adding product: ${error.message}`);
    }
  };

  const handleSoftDelete = async () => {
    const product = deleteConfirmation.product;
    if (!product || auth.role !== 'owner') return;

    try {
      await apiService.updateProduct(auth.token, product.id, { isDeleted: true });
      if (cart.find(item => item.id === product.id)) {
        removeFromCart(product.id);
        logAction('CASCADE_DELETE_CART', `Removed ${product.name} from active cart during deletion`);
      }
      setProducts(products.map(p => p.id === product.id ? { ...p, isDeleted: true } : p));
      logAction('PRODUCT_DELETE', `Soft deleted product: ${product.name} (${product.id})`);
      setDeleteConfirmation({ open: false, product: null });
    } catch (error) {
      alert(`Error deleting product: ${error.message}`);
    }
  };

  const handleUpdateImage = async (file) => {
    if (!file) return;
    const product = editImageModal.product;
    try {
      const formData = new FormData();
      formData.append('image', file);
      const updatedProduct = await apiService.updateProduct(auth.token, product.id, formData, true);
      setProducts(products.map(p => p.id === product.id ? updatedProduct : p));
      logAction('IMAGE_UPDATE', `Updated image for product: ${product.name} (${product.id})`);
      setEditImageModal({ open: false, product: null, preview: null });
    } catch (error) {
      alert('Error updating image. Please try again.');
    }
  };

  const handleUpdateProduct = async (id, updatedData) => {
    if (auth.role !== 'owner') return;
    try {
      const updated = await apiService.updateProduct(auth.token, id, updatedData);
      setProducts(products.map(p => p.id === id ? updated : p));
      logAction('PRODUCT_UPDATE', `Updated product details: ${updated.name} (${id})`);
      setEditProductModal({ open: false, product: null });
      return updated;
    } catch (error) {
      alert(`Error updating product: ${error.message}`);
      throw error;
    }
  };

  const addCashier = async () => {
    const username = newUserUsernameRef.current?.value || '';
    const password = newUserPasswordRef.current?.value || '';
    if (!username || !password) { alert('Please provide username and password'); return; }
    try {
      await apiService.addCashier(auth.token, username, password);
      newUserUsernameRef.current.value = '';
      newUserPasswordRef.current.value = '';
      const list = await apiService.fetchUsers(auth.token);
      setUsers(list);
      alert('Cashier added successfully!');
    } catch (e) {
      alert(e.message);
    }
  };

  const removeUser = async (id) => {
    try {
      await apiService.removeUser(auth.token, id);
      setUsers(users.filter(u => u.id !== id));
    } catch (e) {
      alert('Failed to remove user');
    }
  };

  const clearAllLogs = async () => {
    if (!window.confirm('Are you sure you want to clear all audit logs? This action cannot be undone.')) return;
    
    try {
      if (auth.token && auth.role === 'owner') {
        await apiService.clearAuditLogs(auth.token);
        setServerAuditLogs([]);
      }
      setAuditLogs([]);
    } catch (e) {
      alert(`Error clearing logs: ${e.message}`);
    }
  };

  // --- View Filtering ---
  const filteredProducts = products.filter(p =>
    !p.isDeleted &&
    (p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.barcode.includes(searchQuery) ||
    p.id.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const todaySales = transactions
    .filter(t => new Date(t.date).toDateString() === new Date().toDateString())
    .reduce((sum, t) => sum + t.total, 0);

  const weekSales = transactions
    .filter(t => (Date.now() - new Date(t.date).getTime()) < 7 * 24 * 60 * 60 * 1000)
    .reduce((sum, t) => sum + t.total, 0);

  // --- Handlers for Product Image Upload ---
  const onDrag = (e) => {
    e.preventDefault(); e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
    else if (e.type === 'dragleave') setDragActive(false);
  };

  const onDrop = (e) => {
    e.preventDefault(); e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) handleImageChange(e.dataTransfer.files[0]);
  };

  const handleImageChange = (file) => {
    if (file) {
      if (!file.type.startsWith('image/')) { alert('Please upload an image file'); return; }
      if (file.size > 5 * 1024 * 1024) { alert('File size must be less than 5MB'); return; }
      const url = URL.createObjectURL(file);
      setImagePreview(url);
      setNewProduct({ ...newProduct, image: url, imageFile: file });
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gray-100 dark:bg-[#1A1A1D] transition-colors duration-200 font-sans flex flex-col">
        {/* Header */}
        <header className="bg-white dark:bg-[#1A1A1D] border-b-2 border-gray-200 dark:border-gray-600 shadow-sm transition-colors duration-200">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="relative group">
                  <img src="/logo3.png" alt="Logo" className="w-16 h-16 object-contain transition-all duration-700 ease-in-out transform group-hover:scale-90 group-hover:rotate-[360deg] cursor-pointer" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Point of Sale System</h1>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Small Retail Store Management</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="hidden md:flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <Clock size={16} />
                  <span>{new Date().toLocaleDateString()}</span>
                </div>
                {auth.token && (
                  <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                    <User size={16} />
                    <span className="font-semibold">{auth.username}</span>
                    <span className="text-xs px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-900/40 border border-blue-200 dark:border-blue-800">{auth.role}</span>
                  </div>
                )}
                <button onClick={() => setIsDarkMode(!isDarkMode)} className="p-2 rounded-lg bg-gray-100 dark:bg-[#1A1A1D] text-gray-600 dark:text-yellow-400 hover:bg-gray-200 dark:hover:bg-[#27272a]" title="Toggle Dark Mode">
                  {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                </button>
                <button
                  onClick={() => {
                    if (auth.token) {
                      localStorage.clear();
                      setAuth({ token: null, role: null, username: null });
                    } else {
                      setLoginModalOpen(true);
                    }
                  }}
                  className={`p-2 rounded-lg ${auth.token ? 'bg-red-50 text-red-600 dark:bg-red-900/20' : 'bg-gray-100 dark:bg-[#1A1A1D]'}`}
                  title={auth.token ? 'Logout' : 'Login'}
                >
                  <User size={20} />
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Navigation */}
        <nav className="bg-white dark:bg-[#1A1A1D] border-b-2 border-gray-200 dark:border-gray-600">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex gap-1 overflow-x-auto items-center">
              {[
                { id: 'pos', icon: ShoppingCart, label: 'Point of Sale' },
                { id: 'users', icon: User, label: 'Users', ownerOnly: true },
                { id: 'monitoring', icon: BarChart3, label: 'Sales Monitoring' },
                { id: 'products', icon: Package, label: 'Product Management' }
              ].map(tab => (!tab.ownerOnly || auth.role === 'owner') && (
                <button
                  key={tab.id}
                  onClick={() => setActiveView(tab.id)}
                  className={`flex items-center gap-2 px-6 py-3 font-semibold border-b-2 transition-colors whitespace-nowrap ${
                    activeView === tab.id ? 'text-blue-600 border-blue-600' : 'text-gray-600 border-transparent hover:text-gray-800'
                  }`}
                >
                  <tab.icon size={20} />
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="w-full max-w-7xl mx-auto px-6 py-6 flex-1">
          <div key={activeView} className="animate-view-fade-in">
            {activeView === 'pos' && (
              <POSView
                cart={cart} removeFromCart={removeFromCart} updateQuantity={updateQuantity}
                subtotal={subtotal} tax={tax} total={total}
                amountPaid={amountPaid} setAmountPaid={setAmountPaid} change={change}
                processPayment={processPayment} searchQuery={searchQuery} setSearchQuery={setSearchQuery}
                filteredProducts={filteredProducts} addToCart={addToCart}
              />
            )}
            {activeView === 'monitoring' && (
              <ErrorBoundary>
                <SalesMonitoringView
                  auth={auth} transactions={transactions} lowStockItems={lowStockItems}
                  lowThreshold={lowThreshold} setLowThreshold={setLowThreshold}
                  serverAnalytics={serverAnalytics} todaySales={todaySales} weekSales={weekSales}
                  serverAuditLogs={serverAuditLogs} onClearLogs={clearAllLogs}
                />
              </ErrorBoundary>
            )}
            {activeView === 'products' && (
              <ProductManagementView
                auth={auth} products={products} newProduct={newProduct} setNewProduct={setNewProduct}
                imagePreview={imagePreview} setImagePreview={setImagePreview} onDrag={onDrag} onDrop={onDrop} dragActive={dragActive}
                handleImageChange={handleImageChange} fileInputRef={fileInputRef} addNewProduct={addNewProduct}
                setDeleteConfirmation={setDeleteConfirmation} setEditImageModal={setEditImageModal} 
                setEditProductModal={setEditProductModal} auditLogs={auditLogs} onClearLogs={clearAllLogs}
              />
            )}
            {activeView === 'users' && (
              <UsersManagementView
                users={users} newUserUsernameRef={newUserUsernameRef} newUserPasswordRef={newUserPasswordRef}
                addCashier={addCashier} removeUser={removeUser}
              />
            )}
          </div>
        </main>

        <Footer />
      </div>

      {/* Modals */}
      <ReceiptModal showReceipt={showReceipt} currentReceipt={currentReceipt} setShowReceipt={setShowReceipt} />
      <DeleteModal deleteConfirmation={deleteConfirmation} setDeleteConfirmation={setDeleteConfirmation} handleSoftDelete={handleSoftDelete} />
      <ImageUploadModal editImageModal={editImageModal} setEditImageModal={setEditImageModal} handleUpdateImage={handleUpdateImage} />
      <EditProductModal 
        isOpen={editProductModal.open} 
        onClose={() => setEditProductModal({ open: false, product: null })}
        onSave={handleUpdateProduct}
        product={editProductModal.product}
      />

      {loginModalOpen && (
        <div className="fixed inset-0 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-[#0b1220] dark:to-[#0b1220] flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-[#111317] rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden border border-gray-200 dark:border-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="hidden md:flex flex-col items-center justify-center p-12 bg-gradient-to-br from-blue-700 via-blue-600 to-blue-500 text-white text-center">
                <img src="/logo3.png" alt="Logo" className="w-32 h-32 object-contain mb-8 z-10" />
                <h2 className="text-3xl font-extrabold">POS System</h2>
                <div className="w-12 h-1 bg-white/20 my-6 rounded-full"></div>
                <p className="text-blue-50 text-lg">Manage your business with ease and precision</p>
              </div>
              <div className="p-8">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-2xl font-bold text-gray-800 dark:text-white">Welcome back</h3>
                  <button onClick={() => setLoginModalOpen(false)} className="text-gray-500 hover:text-gray-700"><X size={20} /></button>
                </div>
                <LoginForm
                  onSuccess={(data) => {
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('role', data.role);
                    localStorage.setItem('username', data.username);
                    setAuth({ token: data.token, role: data.role, username: data.username });
                    if (data.role === 'owner') setActiveView('monitoring');
                    setLoginModalOpen(false);
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default POSSystem;
