import React from 'react';
import { Line } from 'react-chartjs-2';
import { Calendar, TrendingUp, BarChart3, CheckCircle, Clock, History } from 'lucide-react';
import StatCard from '../ui/StatCard';

const SalesMonitoringView = ({
  auth,
  transactions,
  lowStockItems,
  lowThreshold,
  setLowThreshold,
  serverAnalytics,
  todaySales,
  weekSales,
  serverAuditLogs
}) => {
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
      {auth.role === 'owner' && (
        <div className="flex items-center justify-between bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-200 dark:border-yellow-800 text-yellow-700 dark:text-yellow-300 px-6 py-3 rounded-lg">
          <div>
            Low-stock items: {lowStockItems.length} at/below threshold
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm">Threshold</span>
            <input
              type="number"
              min="0"
              value={lowThreshold}
              onChange={(e) => setLowThreshold(parseInt(e.target.value || '10', 10))}
              className="w-20 px-2 py-1 border-2 border-yellow-200 dark:border-yellow-800 bg-white dark:bg-[#1A1A1D] text-yellow-700 dark:text-yellow-300 rounded"
            />
          </div>
        </div>
      )}
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard 
          icon={Calendar} 
          accentIcon={TrendingUp} 
          value={`₱${(serverAnalytics?.daily ?? todaySales).toFixed(2)}`} 
          label="Today's Sales" 
          className="bg-gradient-to-br from-blue-500 to-blue-600 text-white" 
          labelClassName="text-blue-100"
        />
        <StatCard 
          icon={BarChart3} 
          accentIcon={TrendingUp} 
          value={`₱${(serverAnalytics?.weekly ?? weekSales).toFixed(2)}`} 
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

      {/* Top Selling */}
      {serverAnalytics?.topProducts && serverAnalytics.topProducts.length > 0 && (
        <div className="bg-white dark:bg-[#1A1A1D] rounded-lg border-2 border-gray-200 dark:border-gray-600 overflow-hidden transition-colors duration-200">
          <div className="bg-gray-50 dark:bg-[#1A1A1D] px-6 py-4 border-b-2 border-gray-200 dark:border-gray-600">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white">Top Selling Products</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-[#1A1A1D] border-b-2 border-gray-200 dark:border-gray-600">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Product</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Qty Sold</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Revenue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {serverAnalytics.topProducts.map((p) => (
                  <tr key={p.product_id} className="hover:bg-gray-50 dark:hover:bg-[#27272a] transition-colors">
                    <td className="px-6 py-4 text-gray-800 dark:text-gray-200">{p.name}</td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{p.qty}</td>
                    <td className="px-6 py-4 font-semibold text-blue-600 dark:text-blue-400">₱{p.revenue.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Monthly Sales Chart */}
      {(Array.isArray(serverAnalytics?.monthlySeries) && serverAnalytics.monthlySeries.length > 0) && (
        <div className="bg-white dark:bg-[#1A1A1D] rounded-lg border-2 border-gray-200 dark:border-gray-600 p-6">
          <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Monthly Sales</h3>
          <div style={{ height: '240px' }}>
            <Line
              data={{
                labels: serverAnalytics.monthlySeries.map((m) => m.month),
                datasets: [
                  {
                    label: 'Revenue',
                    data: serverAnalytics.monthlySeries.map((m) => m.revenue),
                    borderColor: '#2563eb',
                    backgroundColor: 'rgba(37, 99, 235, 0.2)',
                    tension: 0.3
                  },
                  {
                    label: 'Transactions',
                    data: serverAnalytics.monthlySeries.map((m) => m.txns),
                    borderColor: '#10b981',
                    backgroundColor: 'rgba(16, 185, 129, 0.2)',
                    tension: 0.3,
                    yAxisID: 'y1'
                  }
                ]
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  y: { beginAtZero: true },
                  y1: { beginAtZero: true, position: 'right' }
                }
              }}
            />
          </div>
        </div>
      )}

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

      {auth.role === 'owner' && (
        <div className="bg-white dark:bg-[#1A1A1D] rounded-lg border-2 border-gray-200 dark:border-gray-600 overflow-hidden transition-colors duration-200">
          <div className="bg-gray-50 dark:bg-[#1A1A1D] px-6 py-4 border-b-2 border-gray-200 dark:border-gray-600 flex items-center justify-between">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
              <History size={24} />
              Audit Logs (Server)
            </h3>
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-500">{serverAuditLogs.length} records</span>
              <button
                onClick={() => {
                  const header = ['timestamp','action','details','user_id','table_name','action_type','old_values','new_values'];
                  const rows = serverAuditLogs.map(l => [
                    new Date(l.timestamp).toISOString(),
                    l.action,
                    (l.details||'').replaceAll(',',';'),
                    l.user_id ?? '',
                    l.table_name ?? '',
                    l.action_type ?? '',
                    l.old_values ?? '',
                    l.new_values ?? ''
                  ]);
                  const csv = [header.join(','), ...rows.map(r => r.join(','))].join('\n');
                  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `audit_logs_${Date.now()}.csv`;
                  a.click();
                  URL.revokeObjectURL(url);
                }}
                className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Export CSV
              </button>
            </div>
          </div>
          <div className="max-h-60 overflow-y-auto">
            {serverAuditLogs.length === 0 ? (
              <div className="p-8 text-center text-gray-400">No server logs available</div>
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
                  {serverAuditLogs.map((log) => (
                    <tr key={log.id} className="text-sm">
                      <td className="px-6 py-3 font-mono text-gray-600 dark:text-gray-400">
                        {new Date(log.timestamp).toLocaleString()}
                      </td>
                      <td className="px-6 py-3 font-semibold text-gray-800 dark:text-gray-200">{log.action}</td>
                      <td className="px-6 py-3 text-gray-600 dark:text-gray-400">{log.details}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SalesMonitoringView;
