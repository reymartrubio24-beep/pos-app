import React from 'react';

const ReceiptModal = ({ showReceipt, currentReceipt, setShowReceipt }) => {
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

export default ReceiptModal;
