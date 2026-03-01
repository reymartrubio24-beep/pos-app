import React from 'react';
import { ShoppingCart, Search, Package, Trash2, Minus, Plus, DollarSign } from 'lucide-react';
import { getImageUrl } from '../../utils/formatters';

const POSView = ({
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
  filteredProducts,
  addToCart
}) => {
  return (
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
            {filteredProducts.map(product => {
              const isSoldOut = product.stock <= 0;
              return (
                <button
                  key={product.id}
                  onClick={() => !isSoldOut && addToCart(product)}
                  disabled={isSoldOut}
                  className={`flex flex-col h-full p-4 border-2 border-gray-200 dark:border-gray-600 rounded-lg hover:border-blue-500 dark:hover:border-blue-500 hover:shadow-lg transition-all text-left bg-white dark:bg-[#1A1A1D] relative ${isSoldOut ? 'opacity-75 cursor-not-allowed' : ''}`}
                >
                  <div className="w-full aspect-square mb-2 bg-gray-100 dark:bg-[#1A1A1D] rounded overflow-hidden flex items-center justify-center relative">
                    {product.image ? (
                      <img src={getImageUrl(product.image)} alt={product.name} className={`w-full h-full object-cover ${isSoldOut ? 'grayscale' : ''}`} />
                    ) : (
                      <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800 w-full h-full flex items-center justify-center">
                        <Package size={32} className="text-blue-600 dark:text-blue-400" />
                      </div>
                    )}
                    
                    {isSoldOut && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                        <span className="bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg">
                          Sold Out
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-1 truncate w-full">{product.name}</div>
                  <div className="flex justify-between items-center mb-2">
                    <div className="text-xs text-gray-500 dark:text-gray-400">{product.category}</div>
                    <div className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${isSoldOut ? 'bg-red-100 text-red-600 dark:bg-red-900/40' : 'bg-gray-100 text-gray-600 dark:bg-gray-800'}`}>
                      {isSoldOut ? 'Out of Stock' : `Stock: ${product.stock}`}
                    </div>
                  </div>
                  <div className="mt-auto">
                    <div className={`text-lg font-bold ${isSoldOut ? 'text-gray-400' : 'text-blue-600 dark:text-blue-400'}`}>
                      ₱{product.price.toFixed(2)}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{product.id}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default POSView;
