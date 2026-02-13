import { useEffect, useState } from "react";
import {
  ShoppingCart,
  BarChart3,
  Package,
  Search,
  Plus,
  Minus,
  Trash2,
  DollarSign,
  Calendar,
  TrendingUp,
  Clock,
  CheckCircle,
} from "lucide-react";
import PrimaryButton from "./components/ui/PrimaryButton.jsx";
import IconButton from "./components/ui/IconButton.jsx";
import StatCard from "./components/ui/StatCard.jsx";
import SectionCard from "./components/ui/SectionCard.jsx";

const POSView = ({
  filteredProducts,
  addToCart,
  cart,
  removeFromCart,
  updateQuantity,
  subtotal,
  tax,
  total,
  amountPaid,
  setAmountPaid,
  change,
  processPayment,
  searchQuery,
  setSearchQuery,
}) => (
  <div className="flex flex-col xl:flex-row gap-4 h-full">
    <div className="flex-1 flex flex-col">
      <div className="mb-4">
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="text"
            aria-label="Search products"
            placeholder="Search by product name, barcode, or ID..."
            className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto bg-white rounded-lg border-2 border-gray-200 p-4">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {filteredProducts.map((product) => (
            <button
              key={product.id}
              onClick={() => addToCart(product)}
              aria-label={`Add ${product.name} to cart`}
              data-testid={`product-card-${product.id}`}
              className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:shadow-lg transition-all duration-200 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
            >
              <div className="flex items-center justify-center h-16 mb-2 bg-gradient-to-br from-blue-50 to-blue-100 rounded">
                <Package size={32} className="text-blue-600" />
              </div>
              <div className="text-sm font-semibold text-gray-800 mb-1 truncate">
                {product.name}
              </div>
              <div className="text-xs text-gray-500 mb-2">
                {product.category}
              </div>
              <div className="text-lg font-bold text-blue-600">
                ₱{product.price.toFixed(2)}
              </div>
              <div className="text-xs text-gray-400 mt-1">{product.id}</div>
            </button>
          ))}
        </div>
      </div>
    </div>

    <div className="w-full xl:w-96 flex flex-col bg-white rounded-lg border-2 border-gray-200">
      <div className="p-4 border-b-2 border-gray-200 bg-blue-50">
        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <ShoppingCart size={24} />
          Current Transaction
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <ShoppingCart size={48} />
            <p className="mt-2">Cart is empty</p>
          </div>
        ) : (
          <div className="space-y-3">
            {cart.map((item) => (
              <div
                key={item.id}
                data-testid={`cart-item-${item.id}`}
                className="border-2 border-gray-200 rounded-lg p-3"
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <div className="font-semibold text-gray-800">
                      {item.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      ₱{item.price.toFixed(2)} each
                    </div>
                  </div>
                  <IconButton
                    label={`Remove ${item.name}`}
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 size={18} />
                  </IconButton>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <IconButton
                      label={`Decrease quantity for ${item.name}`}
                      onClick={() => updateQuantity(item.id, -1)}
                      className="w-8 h-8 bg-gray-200 hover:bg-gray-300"
                    >
                      <Minus size={16} />
                    </IconButton>
                    <span className="w-12 text-center font-semibold">
                      {item.quantity}
                    </span>
                    <IconButton
                      label={`Increase quantity for ${item.name}`}
                      onClick={() => updateQuantity(item.id, 1)}
                      className="w-8 h-8 bg-gray-200 hover:bg-gray-300"
                    >
                      <Plus size={16} />
                    </IconButton>
                  </div>
                  <div className="font-bold text-blue-600">
                    ₱{(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {cart.length > 0 && (
        <div className="border-t-2 border-gray-200 p-4 space-y-3">
          <div className="space-y-2">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal:</span>
              <span>₱{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>VAT (12%):</span>
              <span>₱{tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-xl font-bold text-gray-800 pt-2 border-t-2 border-gray-200">
              <span>TOTAL:</span>
              <span>₱{total.toFixed(2)}</span>
            </div>
          </div>

          <div>
            <label
              htmlFor="amount-paid"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Amount Paid
            </label>
            <input
              type="number"
              id="amount-paid"
              step="0.01"
              placeholder="0.00"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white text-lg"
              value={amountPaid}
              onChange={(e) => setAmountPaid(e.target.value)}
            />
          </div>

          {amountPaid && parseFloat(amountPaid) >= total && (
            <div className="bg-green-50 border-2 border-green-200 rounded-lg p-3">
              <div className="flex justify-between text-green-700 font-semibold">
                <span>Change:</span>
                <span className="text-xl">₱{change.toFixed(2)}</span>
              </div>
            </div>
          )}

          <PrimaryButton
            onClick={processPayment}
            className="w-full py-3 flex items-center justify-center gap-2"
          >
            <DollarSign size={20} />
            Complete Payment
          </PrimaryButton>
        </div>
      )}
    </div>
  </div>
);

const SalesMonitoringView = ({ todaySales, weekSales, transactions }) => {
  const dailyStats = {};
  transactions.forEach((t) => {
    const date = new Date(t.date).toLocaleDateString();
    if (!dailyStats[date]) {
      dailyStats[date] = { total: 0, count: 0 };
    }
    dailyStats[date].total += t.total;
    dailyStats[date].count += 1;
  });

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          icon={Calendar}
          accentIcon={TrendingUp}
          value={`₱${todaySales.toFixed(2)}`}
          label="Today's Sales"
          className="bg-gradient-to-br from-blue-500 to-blue-600 text-white"
          labelClassName="text-blue-100"
        />
        <StatCard
          icon={BarChart3}
          accentIcon={TrendingUp}
          value={`₱${weekSales.toFixed(2)}`}
          label="This Week's Sales"
          className="bg-gradient-to-br from-green-500 to-green-600 text-white"
          labelClassName="text-green-100"
        />
        <StatCard
          icon={CheckCircle}
          accentIcon={Clock}
          value={transactions.length}
          label="Total Transactions"
          className="bg-gradient-to-br from-purple-500 to-purple-600 text-white"
          labelClassName="text-purple-100"
        />
      </div>

      <SectionCard title="Daily Sales Summary">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b-2 border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  Transactions
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  Total Sales
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  Avg. Transaction
                </th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(dailyStats)
                .reverse()
                .map(([date, stats]) => (
                  <tr
                    key={date}
                    className="border-b border-gray-200 hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 text-gray-800">{date}</td>
                    <td className="px-6 py-4 text-gray-600">{stats.count}</td>
                    <td className="px-6 py-4 font-semibold text-blue-600">
                      ₱{stats.total.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      ₱{(stats.total / stats.count).toFixed(2)}
                    </td>
                  </tr>
                ))}
              {Object.keys(dailyStats).length === 0 && (
                <tr>
                  <td
                    colSpan="4"
                    className="px-6 py-8 text-center text-gray-400"
                  >
                    No sales data available yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </SectionCard>

      <SectionCard title="Recent Transactions">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b-2 border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  Transaction ID
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  Date & Time
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  Items
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  Payment
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  Change
                </th>
              </tr>
            </thead>
            <tbody>
              {transactions.slice(0, 20).map((txn) => (
                <tr
                  key={txn.id}
                  className="border-b border-gray-200 hover:bg-gray-50"
                >
                  <td className="px-6 py-4 font-mono text-sm text-gray-800">
                    {txn.id}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(txn.date).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {txn.items.length} item(s)
                  </td>
                  <td className="px-6 py-4 font-semibold text-blue-600">
                    ₱{txn.total.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    ₱{txn.amountPaid.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-green-600">
                    ₱{txn.change.toFixed(2)}
                  </td>
                </tr>
              ))}
              {transactions.length === 0 && (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-8 text-center text-gray-400"
                  >
                    No transactions yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </SectionCard>
    </div>
  );
};

const ProductManagementView = ({
  newProduct,
  setNewProduct,
  addNewProduct,
  products,
}) => (
  <div className="space-y-6">
    <div className="bg-white rounded-lg border-2 border-gray-200 p-6">
      <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
        <Plus size={24} />
        Add New Product
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="product-name"
            className="block text-sm font-semibold text-gray-700 mb-2"
          >
            Product Name *
          </label>
          <input
            type="text"
            id="product-name"
            className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
            value={newProduct.name}
            onChange={(e) =>
              setNewProduct({ ...newProduct, name: e.target.value })
            }
            placeholder="Enter product name"
          />
        </div>
        <div>
          <label
            htmlFor="product-price"
            className="block text-sm font-semibold text-gray-700 mb-2"
          >
            Price (₱) *
          </label>
          <input
            type="number"
            step="0.01"
            id="product-price"
            className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
            value={newProduct.price}
            onChange={(e) =>
              setNewProduct({ ...newProduct, price: e.target.value })
            }
            placeholder="0.00"
          />
        </div>
        <div>
          <label
            htmlFor="product-barcode"
            className="block text-sm font-semibold text-gray-700 mb-2"
          >
            Barcode *
          </label>
          <input
            type="text"
            id="product-barcode"
            className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
            value={newProduct.barcode}
            onChange={(e) =>
              setNewProduct({ ...newProduct, barcode: e.target.value })
            }
            placeholder="Enter barcode"
          />
        </div>
        <div>
          <label
            htmlFor="product-category"
            className="block text-sm font-semibold text-gray-700 mb-2"
          >
            Category
          </label>
          <input
            type="text"
            id="product-category"
            className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
            value={newProduct.category}
            onChange={(e) =>
              setNewProduct({ ...newProduct, category: e.target.value })
            }
            placeholder="Enter category"
          />
        </div>
      </div>
      <PrimaryButton
        onClick={addNewProduct}
        className="mt-4 py-2 px-6 flex items-center gap-2"
      >
        <Plus size={20} />
        Add Product
      </PrimaryButton>
    </div>

    <SectionCard title="Product Inventory">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b-2 border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                Product ID
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                Name
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                Category
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                Barcode
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                Price
              </th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr
                key={product.id}
                className="border-b border-gray-200 hover:bg-gray-50"
              >
                <td className="px-6 py-4 font-mono text-sm text-gray-800">
                  {product.id}
                </td>
                <td className="px-6 py-4 font-semibold text-gray-800">
                  {product.name}
                </td>
                <td className="px-6 py-4 text-gray-600">{product.category}</td>
                <td className="px-6 py-4 font-mono text-sm text-gray-600">
                  {product.barcode}
                </td>
                <td className="px-6 py-4 font-semibold text-blue-600">
                  ₱{product.price.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </SectionCard>
  </div>
);

const ReceiptModal = ({ showReceipt, currentReceipt, setShowReceipt }) => {
  if (!showReceipt || !currentReceipt) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="receipt-title"
        aria-describedby="receipt-meta"
        className="bg-white rounded-lg shadow-2xl max-w-md w-full max-h-screen overflow-y-auto"
      >
        <div className="p-8 font-mono text-sm">
          <div className="text-center border-b-2 border-dashed border-gray-300 pb-4 mb-4">
            <h2 id="receipt-title" className="text-2xl font-bold mb-2">
              RETAIL STORE
            </h2>
            <p className="text-gray-600">Official Receipt</p>
            <p id="receipt-meta" className="text-xs text-gray-500 mt-2">
              {new Date(currentReceipt.date).toLocaleString()}
            </p>
            <p className="text-xs text-gray-500">
              Transaction: {currentReceipt.id}
            </p>
          </div>

          <div className="space-y-2 mb-4">
            {currentReceipt.items.map((item, idx) => (
              <div key={idx} className="flex justify-between">
                <div className="flex-1">
                  <div className="font-semibold">{item.name}</div>
                  <div className="text-xs text-gray-600">
                    {item.quantity} x ₱{item.price.toFixed(2)}
                  </div>
                </div>
                <div className="font-semibold">
                  ₱{(item.quantity * item.price).toFixed(2)}
                </div>
              </div>
            ))}
          </div>

          <div className="border-t-2 border-dashed border-gray-300 pt-4 space-y-2">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>₱{currentReceipt.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>VAT (12%):</span>
              <span>₱{currentReceipt.tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-xl font-bold border-t-2 border-gray-300 pt-2">
              <span>TOTAL:</span>
              <span>₱{currentReceipt.total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-lg">
              <span>Amount Paid:</span>
              <span>₱{currentReceipt.amountPaid.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-lg text-green-600 font-bold">
              <span>Change:</span>
              <span>₱{currentReceipt.change.toFixed(2)}</span>
            </div>
          </div>

          <div className="text-center text-xs text-gray-500 mt-6 pt-4 border-t-2 border-dashed border-gray-300">
            <p>Thank you for shopping!</p>
            <p className="mt-1">This serves as your official receipt</p>
          </div>
        </div>

        <div className="p-4 border-t-2 border-gray-200 bg-gray-50">
          <PrimaryButton
            onClick={() => setShowReceipt(false)}
            className="w-full py-3"
          >
            Close
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
};

function App() {
  const [activeView, setActiveView] = useState("pos");
  const [products, setProducts] = useState([
    {
      id: "P001",
      name: "White Bread",
      price: 45.0,
      barcode: "8801234567890",
      category: "Bakery",
    },
    {
      id: "P002",
      name: "Coca-Cola 1.5L",
      price: 85.0,
      barcode: "8801234567891",
      category: "Beverages",
    },
    {
      id: "P003",
      name: "Marlboro Red",
      price: 165.0,
      barcode: "8801234567892",
      category: "Tobacco",
    },
    {
      id: "P004",
      name: "Lucky Me Pancit Canton",
      price: 15.0,
      barcode: "8801234567893",
      category: "Instant Noodles",
    },
    {
      id: "P005",
      name: "San Miguel Pale Pilsen",
      price: 55.0,
      barcode: "8801234567894",
      category: "Beverages",
    },
    {
      id: "P006",
      name: "Safeguard Soap",
      price: 35.0,
      barcode: "8801234567895",
      category: "Personal Care",
    },
    {
      id: "P007",
      name: "Alaska Evaporated Milk",
      price: 28.0,
      barcode: "8801234567896",
      category: "Dairy",
    },
    {
      id: "P008",
      name: "Century Tuna",
      price: 32.0,
      barcode: "8801234567897",
      category: "Canned Goods",
    },
    {
      id: "P009",
      name: "Piattos Cheese",
      price: 25.0,
      barcode: "8801234567898",
      category: "Snacks",
    },
    {
      id: "P010",
      name: "Colgate Toothpaste",
      price: 48.0,
      barcode: "8801234567899",
      category: "Personal Care",
    },
  ]);

  const [cart, setCart] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [amountPaid, setAmountPaid] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [showReceipt, setShowReceipt] = useState(false);
  const [currentReceipt, setCurrentReceipt] = useState(null);
  const [currentTime, setCurrentTime] = useState(0);

  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    barcode: "",
    category: "",
  });

  useEffect(() => {
    const updateTime = () => setCurrentTime(Date.now());
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const tax = subtotal * 0.12;
  const total = subtotal + tax;
  const change = amountPaid ? parseFloat(amountPaid) - total : 0;

  const addToCart = (product) => {
    const existingItem = cart.find((item) => item.id === product.id);
    if (existingItem) {
      setCart(
        cart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        ),
      );
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const updateQuantity = (id, delta) => {
    setCart(
      cart
        .map((item) =>
          item.id === id
            ? { ...item, quantity: Math.max(1, item.quantity + delta) }
            : item,
        )
        .filter((item) => item.quantity > 0),
    );
  };

  const removeFromCart = (id) => {
    setCart(cart.filter((item) => item.id !== id));
  };

  const processPayment = () => {
    if (cart.length === 0) {
      alert("Cart is empty!");
      return;
    }
    if (!amountPaid || parseFloat(amountPaid) < total) {
      alert("Insufficient payment amount!");
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
      change,
    };

    setTransactions([transaction, ...transactions]);
    setCurrentReceipt(transaction);
    setShowReceipt(true);
    setCart([]);
    setAmountPaid("");
  };

  const addNewProduct = () => {
    if (!newProduct.name || !newProduct.price || !newProduct.barcode) {
      alert("Please fill in all required fields");
      return;
    }

    const product = {
      id: `P${String(products.length + 1).padStart(3, "0")}`,
      name: newProduct.name,
      price: parseFloat(newProduct.price),
      barcode: newProduct.barcode,
      category: newProduct.category || "General",
    };

    setProducts([...products, product]);
    setNewProduct({ name: "", price: "", barcode: "", category: "" });
    alert("Product added successfully!");
  };

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.barcode.includes(searchQuery) ||
      p.id.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const todaySales = transactions
    .filter(
      (t) => new Date(t.date).toDateString() === new Date().toDateString(),
    )
    .reduce((sum, t) => sum + t.total, 0);

  const weekSales = transactions
    .filter((t) => {
      const diff = currentTime - new Date(t.date).getTime();
      return diff < 7 * 24 * 60 * 60 * 1000;
    })
    .reduce((sum, t) => sum + t.total, 0);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white border-b-2 border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                Point of Sale System
              </h1>
              <p className="text-sm text-gray-600">
                Small Retail Store Management
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Clock size={16} />
              <span>
                {currentTime ? new Date(currentTime).toLocaleDateString() : ""}{" "}
                -{" "}
                {currentTime ? new Date(currentTime).toLocaleTimeString() : ""}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white border-b-2 border-gray-200">
        <div className="max-w-7xl mx-auto px-6">
          <nav className="flex gap-1" aria-label="Primary">
            <button
              onClick={() => setActiveView("pos")}
              aria-pressed={activeView === "pos"}
              className={`flex items-center gap-2 px-6 py-3 font-semibold transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white ${
                activeView === "pos"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              <ShoppingCart size={20} />
              Point of Sale
            </button>
            <button
              onClick={() => setActiveView("monitoring")}
              aria-pressed={activeView === "monitoring"}
              className={`flex items-center gap-2 px-6 py-3 font-semibold transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white ${
                activeView === "monitoring"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              <BarChart3 size={20} />
              Sales Monitoring
            </button>
            <button
              onClick={() => setActiveView("products")}
              aria-pressed={activeView === "products"}
              className={`flex items-center gap-2 px-6 py-3 font-semibold transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white ${
                activeView === "products"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              <Package size={20} />
              Product Management
            </button>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        {activeView === "pos" && (
          <POSView
            filteredProducts={filteredProducts}
            addToCart={addToCart}
            cart={cart}
            removeFromCart={removeFromCart}
            updateQuantity={updateQuantity}
            subtotal={subtotal}
            tax={tax}
            total={total}
            amountPaid={amountPaid}
            setAmountPaid={setAmountPaid}
            change={change}
            processPayment={processPayment}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
        )}
        {activeView === "monitoring" && (
          <SalesMonitoringView
            todaySales={todaySales}
            weekSales={weekSales}
            transactions={transactions}
          />
        )}
        {activeView === "products" && (
          <ProductManagementView
            newProduct={newProduct}
            setNewProduct={setNewProduct}
            addNewProduct={addNewProduct}
            products={products}
          />
        )}
      </div>

      <ReceiptModal
        showReceipt={showReceipt}
        currentReceipt={currentReceipt}
        setShowReceipt={setShowReceipt}
      />
    </div>
  );
}

export default App;
