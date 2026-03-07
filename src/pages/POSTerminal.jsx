import React, { useState, useEffect } from 'react';
import { api } from '../utils/api';
import ProductCard from '../components/POS/ProductCard';
import ProductFilters from '../components/POS/ProductFilters';
import Cart from '../components/POS/Cart';
import PaymentModal from '../components/POS/PaymentModal';
import SuccessModal from '../components/POS/SuccessModal';

const POSTerminal = ({ user }) => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [categories] = useState(['All', 'Beverages', 'Snacks', 'Dairy', 'Canned Goods', 'Bread & Bakery', 'Condiments', 'Personal Care', 'Household']);
  const [loading, setLoading] = useState(true);
  
  // Modal States
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('Cash');
  const [amountReceived, setAmountReceived] = useState('');
  const [transactionResult, setTransactionResult] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const data = await api.get(`/api/products/index.php?category=${category}&search=${search}`);
        setProducts(data);
      } catch (err) {
        console.error('Failed to fetch products', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [category, search]);

  const addToCart = (product) => {
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
      if (existing.quantity >= product.stock) {
        alert('Insufficient stock available');
        return;
      }
      setCart(cart.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const removeFromCart = (id) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const updateQuantity = (id, delta, stock) => {
    setCart(cart.map(item => {
      if (item.id === id) {
        const newQty = item.quantity + delta;
        if (newQty < 1) return item;
        if (newQty > stock) {
          alert('Insufficient stock');
          return item;
        }
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const vat = subtotal * 0.12;
  const total = subtotal + vat;
  const change = Math.max(0, (parseFloat(amountReceived) || 0) - total);

  const handleCheckout = () => {
    if (cart.length === 0) return;
    setAmountReceived('');
    setPaymentMethod('Cash');
    setShowPaymentModal(true);
  };

  const confirmPayment = async () => {
    const received = paymentMethod === 'Cash' ? (parseFloat(amountReceived) || 0) : total;
    if (paymentMethod === 'Cash' && received < total) {
      alert('Amount received is less than total price');
      return;
    }

    setIsProcessing(true);
    try {
      const data = await api.post('/api/transactions/create.php', {
        items: cart,
        subtotal,
        vat,
        total,
        payment_method: paymentMethod,
        cashier_id: user?.id || 1,
        amount_received: received
      });

      if (data.success) {
        setTransactionResult({
          id: data.id,
          date: new Date().toLocaleString(),
          items: [...cart],
          total,
          paid: received,
          change: paymentMethod === 'Cash' ? change : 0
        });
        setCart([]);
        setShowPaymentModal(false);
        setShowSuccessModal(true);
        // Refresh products to show updated stock
        const freshProducts = await api.get(`/api/products/index.php?category=${category}&search=${search}`);
        setProducts(freshProducts);
      }
    } catch (err) {
      alert(err.message || 'Transaction Failed');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="pos-container">
      <div className="pos-products-section">
        <ProductFilters 
          search={search} 
          setSearch={setSearch} 
          category={category} 
          setCategory={setCategory} 
          categories={categories} 
        />

        <div style={{ flex: 1, overflowY: 'auto', paddingBottom: '20px' }}>
          {loading ? (
             <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '100px' }}>
                <div className="animate-spin" style={{ width: '40px', height: '40px', border: '4px solid var(--slate-200)', borderTop: '4px solid var(--primary)', borderRadius: '50%' }}></div>
             </div>
          ) : (
            <div className="product-grid">
              {products.map(product => (
                <ProductCard 
                   key={product.id} 
                   product={product} 
                   onClick={addToCart} 
                />
              ))}
              {products.length === 0 && !loading && (
                <div style={{ gridColumn: '1/-1', textAlign: 'center', paddingTop: '100px', color: 'var(--slate-400)' }}>
                  <p>No products found matching your criteria.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <Cart 
        cart={cart}
        user={user}
        onUpdateQuantity={updateQuantity}
        onRemove={removeFromCart}
        onClear={() => setCart([])}
        onCheckout={handleCheckout}
        subtotal={subtotal}
        vat={vat}
        total={total}
      />

      <PaymentModal 
        show={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        onConfirm={confirmPayment}
        subtotal={subtotal}
        vat={vat}
        total={total}
        paymentMethod={paymentMethod}
        setPaymentMethod={setPaymentMethod}
        amountReceived={amountReceived}
        setAmountReceived={setAmountReceived}
        isProcessing={isProcessing}
      />

      <SuccessModal 
        show={showSuccessModal}
        transactionResult={transactionResult}
        onClose={() => setShowSuccessModal(false)}
      />
    </div>
  );
};

export default POSTerminal;

