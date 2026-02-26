import React, { useState, useEffect, useRef } from 'react';
import { ShoppingCart, BarChart3, Package, Settings, User, Search, Plus, Minus, Trash2, DollarSign, Calendar, TrendingUp, Clock, CheckCircle, Moon, Sun, Upload, X, Image as ImageIcon, Edit, AlertTriangle, History } from 'lucide-react';
import Footer from './components/Footer';

const POSSystem = () => {
  // State Management
  const [activeView, setActiveView] = useState('pos');
  const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem('darkMode') === 'true');
  const [products, setProducts] = useState([]);
  const [, setLoading] = useState(true);

  // Fetch products from backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/products');
        if (response.ok) {
          const data = await response.json();
          setProducts(data);
        } else {
          console.error('Failed to fetch products');
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);
  
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
  
  // New Product Form State
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    barcode: '',
    category: '',
    image: null
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  // Dark Mode Effect
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', isDarkMode);
  }, [isDarkMode]);

  // Calculate totals
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * 0.12; // 12% VAT
  const total = subtotal + tax;
  const change = amountPaid ? parseFloat(amountPaid) - total : 0;

  // Add to cart
  const addToCart = (product) => {
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
      setCart(cart.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  // Update quantity
  const updateQuantity = (id, delta) => {
    setCart(cart.map(item =>
      item.id === id
        ? { ...item, quantity: Math.max(1, item.quantity + delta) }
        : item
    ).filter(item => item.quantity > 0));
  };

  // Remove from cart
  const removeFromCart = (id) => {
    setCart(cart.filter(item => item.id !== id));
  };

  // Process payment
  const processPayment = () => {
    if (cart.length === 0) {
      alert('Cart is empty!');
      return;
    }
    if (!amountPaid || parseFloat(amountPaid) < total) {
      alert('Insufficient payment amount!');
      return;
    }

    const transaction = {
      id: `TXN${Date.now()}`,
      date: new Date(),
      items: [...cart],
      subtotal,
      tax,
      total,
      amountPaid: parseFloat(amountPaid),
      change
    };

    setTransactions([transaction, ...transactions]);
    setCurrentReceipt(transaction);
    setShowReceipt(true);
    setCart([]);
    setAmountPaid('');
  };

  // Handle Image Upload
  const handleImageChange = (file) => {
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Please upload an image file');
        return;
      }
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        alert('File size must be less than 5MB');
        return;
      }
      const imageUrl = URL.createObjectURL(file);
      setImagePreview(imageUrl);
      setNewProduct({ ...newProduct, image: imageUrl, imageFile: file });
    }
  };

  const onDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const onDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageChange(e.dataTransfer.files[0]);
    }
  };

  // Add new product
  const addNewProduct = async () => {
    if (!newProduct.name || !newProduct.price || !newProduct.barcode) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('name', newProduct.name);
      formData.append('price', newProduct.price);
      formData.append('barcode', newProduct.barcode);
      formData.append('category', newProduct.category || 'General');
      if (newProduct.imageFile) {
        formData.append('image', newProduct.imageFile);
      }

      const response = await fetch('http://localhost:3001/api/products', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to add product');
      }

      const product = await response.json();

      setProducts([...products, product]);
      setNewProduct({ name: '', price: '', barcode: '', category: '', image: null, imageFile: null });
      setImagePreview(null);
      alert('Product added successfully!');
    } catch (error) {
      console.error('Error adding product:', error);
      alert('Error adding product. Please try again.');
    }
  };

  // Audit Log Helper
  const logAction = (action, details) => {
    const log = {
      id: `LOG${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      action,
      details
    };
    setAuditLogs(prev => [log, ...prev]);
    console.log(`[AUDIT] ${action}:`, details);
  };

  // Soft Delete Product
  const handleSoftDelete = async () => {
    const product = deleteConfirmation.product;
    if (!product) return;

    try {
      const response = await fetch(`http://localhost:3001/api/products/${product.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isDeleted: true }),
      });

      if (!response.ok) {
        throw new Error('Failed to delete product');
      }

      // Cascade: Remove from cart if present
      const inCart = cart.find(item => item.id === product.id);
      if (inCart) {
        removeFromCart(product.id);
        logAction('CASCADE_DELETE_CART', `Removed ${product.name} from active cart during deletion`);
      }

      setProducts(products.map(p => 
        p.id === product.id ? { ...p, isDeleted: true } : p
      ));
      
      logAction('PRODUCT_DELETE', `Soft deleted product: ${product.name} (${product.id})`);
      setDeleteConfirmation({ open: false, product: null });
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Error deleting product. Please try again.');
    }
  };

  // Update Product Image
  const handleUpdateImage = async (file) => {
    if (!file) return;
    
    // Validation
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      alert('Invalid file type. Please upload JPEG, PNG, or WebP.');
      return;
    }
    
    if (file.size > 5 * 1024 * 1024) {
      alert('File size exceeds 5MB limit.');
      return;
    }

    const product = editImageModal.product;

    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch(`http://localhost:3001/api/products/${product.id}`, {
        method: 'PUT',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to update image');
      }

      const updatedProduct = await response.json();

      setProducts(products.map(p => 
        p.id === product.id ? updatedProduct : p
      ));

      logAction('IMAGE_UPDATE', `Updated image for product: ${product.name} (${product.id})`);
      setEditImageModal({ open: false, product: null, preview: null });
    } catch (error) {
      console.error('Error updating image:', error);
      alert('Error updating image. Please try again.');
    }
  };

  // Filter products
  const filteredProducts = products.filter(p =>
    !p.isDeleted &&
    (p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.barcode.includes(searchQuery) ||
    p.id.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Calculate statistics
  const todaySales = transactions
    .filter(t => new Date(t.date).toDateString() === new Date().toDateString())
    .reduce((sum, t) => sum + t.total, 0);

  const weekSales = transactions
    .filter(t => {
      const diff = Date.now() - new Date(t.date).getTime();
      return diff < 7 * 24 * 60 * 60 * 1000;
    })
    .reduce((sum, t) => sum + t.total, 0);

  // POS View
  const POSView = () => (
    <div className="grid grid-cols-1 md:grid-cols-[1fr_24rem] gap-4 h-full">
        {/* Cart Section - Positioned Right on Desktop */}
      <div className="md:col-start-2 md:row-start-1 w-full flex flex-col bg-white dark:bg-[#1A1A1D] rounded-lg border-2 border-gray-200 dark:border-gray-600 transition-colors duration-200">
        <div className="p-4 border-b-2 border-gray-200 dark:border-gray-600 bg-blue-50 dark:bg-[#1A1A1D]">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
            <ShoppingCart size={24} />
            Current Transaction
          </h2>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400 dark:text-gray-400">
              <ShoppingCart size={48} />
              <p className="mt-2">Cart is empty</p>
            </div>
          ) : (
            <div className="space-y-3">
              {cart.map(item => (
                <div key={item.id} className="border-2 border-gray-200 dark:border-gray-600 rounded-lg p-3 bg-white dark:bg-[#1A1A1D]">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-gray-800 dark:text-gray-200 truncate">{item.name}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">₱{item.price.toFixed(2)} each</div>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-500 hover:text-red-700 dark:hover:text-red-400"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.id, -1)}
                        className="w-8 h-8 rounded bg-gray-200 dark:bg-[#1A1A1D] hover:bg-gray-300 dark:hover:bg-[#27272a] flex items-center justify-center text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-600"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="w-12 text-center font-semibold text-gray-800 dark:text-gray-200">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        className="w-8 h-8 rounded bg-gray-200 dark:bg-[#1A1A1D] hover:bg-gray-300 dark:hover:bg-[#27272a] flex items-center justify-center text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-600"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                    <div className="font-bold text-blue-600 dark:text-blue-400">
                      ₱{(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {cart.length > 0 && (
          <div className="border-t-2 border-gray-200 dark:border-gray-600 p-4 space-y-3 bg-white dark:bg-[#1A1A1D]">
            <div className="space-y-2">
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Subtotal:</span>
                <span>₱{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>VAT (12%):</span>
                <span>₱{tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xl font-bold text-gray-800 dark:text-white pt-2 border-t-2 border-gray-200 dark:border-gray-600">
                <span>TOTAL:</span>
                <span>₱{total.toFixed(2)}</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Amount Paid
              </label>
              <input
                type="number"
                step="0.01"
                placeholder="0.00"
                className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-[#1A1A1D] text-gray-800 dark:text-white rounded-lg focus:border-blue-500 focus:outline-none text-lg"
                value={amountPaid}
                onChange={(e) => setAmountPaid(e.target.value)}
              />
            </div>

            {amountPaid && parseFloat(amountPaid) >= total && (
              <div className="bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-800 rounded-lg p-3">
                <div className="flex justify-between text-green-700 dark:text-green-400 font-semibold">
                  <span>Change:</span>
                  <span className="text-xl">₱{change.toFixed(2)}</span>
                </div>
              </div>
            )}

            <button
              onClick={processPayment}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <DollarSign size={20} />
              Complete Payment
            </button>
          </div>
        )}
      </div>

      {/* Products Section - Positioned Left on Desktop */}
      <div className="md:col-start-1 md:row-start-1 flex flex-col h-full">
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by product name, barcode, or ID..."
              className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-[#1A1A1D] text-gray-800 dark:text-white rounded-lg focus:border-blue-500 focus:outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto bg-white dark:bg-[#1A1A1D] rounded-lg border-2 border-gray-200 dark:border-gray-600 p-4 transition-colors duration-200">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {filteredProducts.map(product => (
              <button
                key={product.id}
                onClick={() => addToCart(product)}
                className="flex flex-col h-full p-4 border-2 border-gray-200 dark:border-gray-600 rounded-lg hover:border-blue-500 dark:hover:border-blue-500 hover:shadow-lg transition-all text-left bg-white dark:bg-[#1A1A1D]"
              >
                <div className="w-full aspect-square mb-2 bg-gray-100 dark:bg-[#1A1A1D] rounded overflow-hidden flex items-center justify-center relative">
                  {product.image ? (
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800 w-full h-full flex items-center justify-center">
                      <Package size={32} className="text-blue-600 dark:text-blue-400" />
                    </div>
                  )}
                </div>
                <div className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-1 truncate w-full">{product.name}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">{product.category}</div>
                <div className="mt-auto">
                  <div className="text-lg font-bold text-blue-600 dark:text-blue-400">₱{product.price.toFixed(2)}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{product.id}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // Sales Monitoring View
  const SalesMonitoringView = () => {
    const dailyStats = {};
    transactions.forEach(t => {
      const date = new Date(t.date).toLocaleDateString();
      if (!dailyStats[date]) {
        dailyStats[date] = { total: 0, count: 0 };
      }
      dailyStats[date].total += t.total;
      dailyStats[date].count += 1;
    });

    return (
      <div className="space-y-6">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-lg shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <Calendar size={32} />
              <TrendingUp size={24} />
            </div>
            <div className="text-3xl font-bold mb-1">₱{todaySales.toFixed(2)}</div>
            <div className="text-blue-100">Today's Sales</div>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-lg shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <BarChart3 size={32} />
              <TrendingUp size={24} />
            </div>
            <div className="text-3xl font-bold mb-1">₱{weekSales.toFixed(2)}</div>
            <div className="text-green-100">This Week's Sales</div>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-lg shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <CheckCircle size={32} />
              <Clock size={24} />
            </div>
            <div className="text-3xl font-bold mb-1">{transactions.length}</div>
            <div className="text-purple-100">Total Transactions</div>
          </div>
        </div>

        {/* Daily Sales Table */}
        <div className="bg-white dark:bg-[#1A1A1D] rounded-lg border-2 border-gray-200 dark:border-gray-600 overflow-hidden transition-colors duration-200">
          <div className="bg-gray-50 dark:bg-[#1A1A1D] px-6 py-4 border-b-2 border-gray-200 dark:border-gray-600">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white">Daily Sales Summary</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-[#1A1A1D] border-b-2 border-gray-200 dark:border-gray-600">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Date</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Transactions</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Total Sales</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Avg. Transaction</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {Object.entries(dailyStats).reverse().map(([date, stats]) => (
                  <tr key={date} className="hover:bg-gray-50 dark:hover:bg-[#27272a] transition-colors">
                    <td className="px-6 py-4 text-gray-800 dark:text-gray-200">{date}</td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{stats.count}</td>
                    <td className="px-6 py-4 font-semibold text-blue-600 dark:text-blue-400">₱{stats.total.toFixed(2)}</td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-400">₱{(stats.total / stats.count).toFixed(2)}</td>
                  </tr>
                ))}
                {Object.keys(dailyStats).length === 0 && (
                  <tr>
                    <td colSpan="4" className="px-6 py-8 text-center text-gray-400 dark:text-gray-400">
                      No sales data available yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white dark:bg-[#1A1A1D] rounded-lg border-2 border-gray-200 dark:border-gray-600 overflow-hidden transition-colors duration-200">
          <div className="bg-gray-50 dark:bg-[#1A1A1D] px-6 py-4 border-b-2 border-gray-200 dark:border-gray-600">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white">Recent Transactions</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-[#1A1A1D] border-b-2 border-gray-200 dark:border-gray-600">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Transaction ID</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Date & Time</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Items</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Total</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Payment</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Change</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {transactions.slice(0, 20).map(txn => (
                  <tr key={txn.id} className="hover:bg-gray-50 dark:hover:bg-[#27272a] transition-colors">
                    <td className="px-6 py-4 font-mono text-sm text-gray-800 dark:text-gray-200">{txn.id}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                      {new Date(txn.date).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{txn.items.length} item(s)</td>
                    <td className="px-6 py-4 font-semibold text-blue-600 dark:text-blue-400">₱{txn.total.toFixed(2)}</td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-400">₱{txn.amountPaid.toFixed(2)}</td>
                    <td className="px-6 py-4 text-green-600 dark:text-green-400">₱{txn.change.toFixed(2)}</td>
                  </tr>
                ))}
                {transactions.length === 0 && (
                  <tr>
                    <td colSpan="6" className="px-6 py-8 text-center text-gray-400 dark:text-gray-400">
                      No transactions yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  // Product Management View
  const ProductManagementView = () => (
    <div className="space-y-6">
      {/* Add New Product Form */}
      <div className="bg-white dark:bg-[#1A1A1D] rounded-lg border-2 border-gray-200 dark:border-gray-600 p-6 transition-colors duration-200">
        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
          <Plus size={24} />
          Add New Product
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Product Name *</label>
            <input
              type="text"
              className="w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-[#1A1A1D] text-gray-800 dark:text-white rounded-lg focus:border-blue-500 focus:outline-none"
              value={newProduct.name}
              onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
              placeholder="Enter product name"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Price (₱) *</label>
            <input
              type="number"
              step="0.01"
              className="w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-[#1A1A1D] text-gray-800 dark:text-white rounded-lg focus:border-blue-500 focus:outline-none"
              value={newProduct.price}
              onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
              placeholder="0.00"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Barcode *</label>
            <input
              type="text"
              className="w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-[#1A1A1D] text-gray-800 dark:text-white rounded-lg focus:border-blue-500 focus:outline-none"
              value={newProduct.barcode}
              onChange={(e) => setNewProduct({ ...newProduct, barcode: e.target.value })}
              placeholder="Enter barcode"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Category</label>
            <input
              type="text"
              className="w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-[#1A1A1D] text-gray-800 dark:text-white rounded-lg focus:border-blue-500 focus:outline-none"
              value={newProduct.category}
              onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
              placeholder="Enter category"
            />
          </div>
          
          {/* Image Upload Section */}
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Product Image</label>
            <label 
              className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer transition-colors
                ${dragActive 
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                  : 'border-gray-300 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400'}`}
              onDragEnter={onDrag}
              onDragLeave={onDrag}
              onDragOver={onDrag}
              onDrop={onDrop}
            >
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept="image/jpeg, image/png, image/webp"
                onChange={(e) => handleImageChange(e.target.files[0])}
              />
              
              {imagePreview ? (
                <div className="relative group">
                  <img src={imagePreview} alt="Preview" className="h-32 w-32 object-cover rounded-lg" />
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setImagePreview(null);
                      setNewProduct({ ...newProduct, image: null });
                    }}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <div className="text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-semibold text-blue-600 dark:text-blue-400">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">JPEG, PNG, WebP up to 5MB</p>
                </div>
              )}
            </label>
            <p className="text-xs text-gray-500 mt-2">
              Note: Uploaded images are stored securely on the server.
            </p>
          </div>
        </div>
        <button
          onClick={addNewProduct}
          className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition-colors flex items-center gap-2"
        >
          <Plus size={20} />
          Add Product
        </button>
      </div>

      {/* Products List */}
      <div className="bg-white dark:bg-[#1A1A1D] rounded-lg border-2 border-gray-200 dark:border-gray-600 overflow-hidden transition-colors duration-200">
        <div className="bg-gray-50 dark:bg-[#1A1A1D] px-6 py-4 border-b-2 border-gray-200 dark:border-gray-600">
          <h3 className="text-xl font-bold text-gray-800 dark:text-white">Product Inventory</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-[#1A1A1D] border-b-2 border-gray-200 dark:border-gray-600">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Image</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Product ID</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Name</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Category</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Barcode</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Price</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {products.map(product => !product.isDeleted && (
                <tr key={product.id} className="hover:bg-gray-50 dark:hover:bg-[#27272a] transition-colors">
                  <td className="px-6 py-4">
                    <div className="h-10 w-10 bg-gray-100 dark:bg-[#1A1A1D] rounded overflow-hidden flex items-center justify-center cursor-pointer group relative" onClick={() => setEditImageModal({ open: true, product, preview: product.image })}>
                      {product.image ? (
                        <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
                      ) : (
                        <ImageIcon size={20} className="text-gray-400" />
                      )}
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 flex items-center justify-center transition-all">
                          <Edit size={16} className="text-white opacity-0 group-hover:opacity-100" />
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-mono text-sm text-gray-800 dark:text-gray-200">{product.id}</td>
                  <td className="px-6 py-4 font-semibold text-gray-800 dark:text-gray-200">{product.name}</td>
                  <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{product.category}</td>
                  <td className="px-6 py-4 font-mono text-sm text-gray-600 dark:text-gray-400">{product.barcode}</td>
                  <td className="px-6 py-4 font-semibold text-blue-600 dark:text-blue-400">₱{product.price.toFixed(2)}</td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                        <button 
                            onClick={() => setEditImageModal({ open: true, product, preview: product.image })}
                            className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg"
                            title="Update Image"
                        >
                            <ImageIcon size={18} />
                        </button>
                        <button 
                            onClick={() => setDeleteConfirmation({ open: true, product })}
                            className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                            title="Delete Product"
                        >
                            <Trash2 size={18} />
                        </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Audit Logs Section */}
      <div className="bg-white dark:bg-[#1A1A1D] rounded-lg border-2 border-gray-200 dark:border-gray-600 overflow-hidden transition-colors duration-200">
         <div className="bg-gray-50 dark:bg-[#1A1A1D] px-6 py-4 border-b-2 border-gray-200 dark:border-gray-600 flex items-center justify-between">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                <History size={24} />
                Audit Log
            </h3>
            <span className="text-sm text-gray-500">{auditLogs.length} records</span>
         </div>
         <div className="max-h-60 overflow-y-auto">
             {auditLogs.length === 0 ? (
                 <div className="p-8 text-center text-gray-400">No activity recorded yet</div>
             ) : (
                 <table className="w-full">
                    <thead className="bg-gray-50 dark:bg-[#1A1A1D] sticky top-0">
                        <tr>
                            <th className="px-6 py-2 text-left text-xs font-semibold text-gray-500 uppercase">Time</th>
                            <th className="px-6 py-2 text-left text-xs font-semibold text-gray-500 uppercase">Action</th>
                            <th className="px-6 py-2 text-left text-xs font-semibold text-gray-500 uppercase">Details</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {auditLogs.map(log => (
                            <tr key={log.id} className="text-sm">
                                <td className="px-6 py-3 font-mono text-gray-600 dark:text-gray-400">
                                    {log.timestamp.toLocaleTimeString()}
                                </td>
                                <td className="px-6 py-3 font-semibold text-gray-800 dark:text-gray-200">
                                    {log.action}
                                </td>
                                <td className="px-6 py-3 text-gray-600 dark:text-gray-400">
                                    {log.details}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                 </table>
             )}
         </div>
      </div>
    </div>
  );

  // Delete Confirmation Modal
  const DeleteModal = () => {
    if (!deleteConfirmation.open) return null;
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-[#1A1A1D] rounded-lg shadow-xl max-w-sm w-full p-6 border-2 border-red-100 dark:border-red-900/30">
          <div className="flex flex-col items-center text-center">
            <div className="bg-red-100 dark:bg-red-900/30 p-3 rounded-full mb-4">
              <AlertTriangle className="text-red-600 dark:text-red-400" size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Delete Product?</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Are you sure you want to delete <strong>{deleteConfirmation.product?.name}</strong>? This action will remove it from inventory and active carts.
            </p>
            <div className="flex gap-3 w-full">
              <button
                onClick={() => setDeleteConfirmation({ open: false, product: null })}
                className="flex-1 py-2 px-4 border-2 border-gray-200 dark:border-gray-600 rounded-lg text-gray-600 dark:text-gray-300 font-semibold hover:bg-gray-50 dark:hover:bg-[#27272a]"
              >
                Cancel
              </button>
              <button
                onClick={handleSoftDelete}
                className="flex-1 py-2 px-4 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Image Upload Modal
  const ImageUploadModal = () => {
    if (!editImageModal.open) return null;
    
    const onModalDrop = (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
         const file = e.dataTransfer.files[0];
         const url = URL.createObjectURL(file);
         setEditImageModal(prev => ({ ...prev, preview: url, file }));
      }
    };

    const handleFileSelect = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const url = URL.createObjectURL(file);
            setEditImageModal(prev => ({ ...prev, preview: url, file }));
        }
    }

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-[#1A1A1D] rounded-lg shadow-xl max-w-md w-full p-6 border-2 border-gray-200 dark:border-gray-600">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
              <ImageIcon size={20} />
              Update Image
            </h3>
            <button onClick={() => setEditImageModal({ open: false, product: null, preview: null })} className="text-gray-500 hover:text-gray-700">
              <X size={20} />
            </button>
          </div>
          
          <div className="mb-4">
             <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Product: <strong>{editImageModal.product?.name}</strong></p>
             
             <label 
              className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 transition-colors bg-gray-50 dark:bg-[#27272a]"
              onDragOver={(e) => e.preventDefault()}
              onDrop={onModalDrop}
             >
               <input type="file" className="hidden" accept="image/jpeg, image/png, image/webp" onChange={handleFileSelect} />
               
               {editImageModal.preview ? (
                 <img src={editImageModal.preview} alt="Preview" className="h-40 w-40 object-contain rounded-lg mb-2" />
               ) : (
                 <Upload className="h-12 w-12 text-gray-400 mb-2" />
               )}
               
               <p className="text-sm text-center text-gray-500">
                 {editImageModal.preview ? 'Click or drag to change' : 'Drag image here or click to browse'}
               </p>
               <p className="text-xs text-gray-400 mt-1">JPEG, PNG, WebP (Max 5MB)</p>
             </label>
          </div>

          <div className="flex justify-end gap-3">
             <button
                onClick={() => setEditImageModal({ open: false, product: null, preview: null })}
                className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#27272a] rounded-lg"
              >
                Cancel
              </button>
              <button
                disabled={!editImageModal.preview}
                onClick={() => handleUpdateImage(editImageModal.file)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Save Changes
              </button>
          </div>
        </div>
      </div>
    );
  };

  // Receipt Modal
  const ReceiptModal = () => {
    if (!showReceipt || !currentReceipt) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-[#1A1A1D] rounded-lg shadow-2xl max-w-md w-full max-h-screen overflow-y-auto transition-colors duration-200">
          <div className="p-8 font-mono text-sm text-gray-800 dark:text-gray-200">
            <div className="text-center border-b-2 border-dashed border-gray-300 dark:border-gray-600 pb-4 mb-4">
              <h2 className="text-2xl font-bold mb-2">RETAIL STORE</h2>
              <p className="text-gray-600 dark:text-gray-400">Official Receipt</p>
              <p className="text-xs text-gray-500 mt-2">{new Date(currentReceipt.date).toLocaleString()}</p>
              <p className="text-xs text-gray-500">Transaction: {currentReceipt.id}</p>
            </div>

            <div className="space-y-2 mb-4">
              {currentReceipt.items.map((item, idx) => (
                <div key={idx} className="flex justify-between">
                  <div className="flex-1">
                    <div className="font-semibold">{item.name}</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">
                      {item.quantity} x ₱{item.price.toFixed(2)}
                    </div>
                  </div>
                  <div className="font-semibold">₱{(item.quantity * item.price).toFixed(2)}</div>
                </div>
              ))}
            </div>

            <div className="border-t-2 border-dashed border-gray-300 dark:border-gray-600 pt-4 space-y-2">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>₱{currentReceipt.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>VAT (12%):</span>
                <span>₱{currentReceipt.tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xl font-bold border-t-2 border-gray-300 dark:border-gray-600 pt-2">
                <span>TOTAL:</span>
                <span>₱{currentReceipt.total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-lg">
                <span>Amount Paid:</span>
                <span>₱{currentReceipt.amountPaid.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-lg text-green-600 dark:text-green-400 font-bold">
                <span>Change:</span>
                <span>₱{currentReceipt.change.toFixed(2)}</span>
              </div>
            </div>

            <div className="text-center text-xs text-gray-500 mt-6 pt-4 border-t-2 border-dashed border-gray-300 dark:border-gray-600">
              <p>Thank you for shopping!</p>
              <p className="mt-1">This serves as your official receipt</p>
            </div>
          </div>

          <div className="p-4 border-t-2 border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-[#1A1A1D]">
            <button
              onClick={() => setShowReceipt(false)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="min-h-screen bg-gray-100 dark:bg-[#1A1A1D] transition-colors duration-200 font-sans flex flex-col">
        {/* Header */}
        <div className="bg-white dark:bg-[#1A1A1D] border-b-2 border-gray-200 dark:border-gray-600 shadow-sm transition-colors duration-200">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="relative group">
                  <img 
                    src="/logo3.png" 
                    alt="Logo" 
                    className="w-16 h-16 object-contain transition-all duration-700 ease-in-out transform group-hover:scale-90 group-hover:rotate-[360deg] cursor-pointer drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]"
                  />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Point of Sale System</h1>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Small Retail Store Management</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hidden md:flex">
                  <Clock size={16} />
                  <span>{new Date().toLocaleDateString()}</span>
                </div>
                <button
                  onClick={() => setIsDarkMode(!isDarkMode)}
                  className="p-2 rounded-lg bg-gray-100 dark:bg-[#1A1A1D] text-gray-600 dark:text-yellow-400 hover:bg-gray-200 dark:hover:bg-[#27272a] transition-colors"
                  title="Toggle Dark Mode"
                >
                  {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="bg-white dark:bg-[#1A1A1D] border-b-2 border-gray-200 dark:border-gray-600 transition-colors duration-200">
          <div className="max-w-7xl mx-auto px-6">
            <nav className="flex gap-1 overflow-x-auto">
              <button
                onClick={() => setActiveView('pos')}
                className={`flex items-center gap-2 px-6 py-3 font-semibold transition-colors whitespace-nowrap ${
                  activeView === 'pos'
                    ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
                }`}
              >
                <ShoppingCart size={20} />
                Point of Sale
              </button>
              <button
                onClick={() => setActiveView('monitoring')}
                className={`flex items-center gap-2 px-6 py-3 font-semibold transition-colors whitespace-nowrap ${
                  activeView === 'monitoring'
                    ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
                }`}
              >
                <BarChart3 size={20} />
                Sales Monitoring
              </button>
              <button
                onClick={() => setActiveView('products')}
                className={`flex items-center gap-2 px-6 py-3 font-semibold transition-colors whitespace-nowrap ${
                  activeView === 'products'
                    ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
                }`}
              >
                <Package size={20} />
                Product Management
              </button>
            </nav>
          </div>
        </div>

        {/* Main Content — flex-grow to push footer down */}
        <div className="w-full max-w-7xl mx-auto px-6 py-6 flex-1">
          {activeView === 'pos' && POSView()}
          {activeView === 'monitoring' && SalesMonitoringView()}
          {activeView === 'products' && ProductManagementView()}
        </div>

        {/* Modals (inside main container for proper event bubbling) */}
        <ReceiptModal />
        <DeleteModal />
        <ImageUploadModal />
        
        {/* Footer — Inside flex container */}
        <Footer />
      </div>
    </>
  );
};

export default POSSystem;
