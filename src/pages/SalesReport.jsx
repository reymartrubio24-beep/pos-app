import React, { useState, useEffect } from 'react';
import { api } from '../utils/api';
import StatsCards from '../components/Sales/StatsCards';
import TransactionTable from '../components/Sales/TransactionTable';
import ConfirmModal from '../components/Common/ConfirmModal';

const SalesReport = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dates, setDates] = useState({ 
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], 
    end: new Date().toISOString().split('T')[0] 
  });
  
  // Confirmation state
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    fetchSales();
  }, [dates]);

  const fetchSales = async () => {
    setLoading(true);
    try {
      const data = await api.get(`/api/sales/report.php?start_date=${dates.start}&end_date=${dates.end}`);
      setTransactions(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Fetch sales error:', err);
    } finally {
      setLoading(false);
    }
  };

  const totalSales = transactions.reduce((sum, t) => sum + parseFloat(t.total), 0);

   const handleClearAll = () => {
    setShowConfirm(true);
  };

  const handleConfirmClear = async () => {
    try {
      const data = await api.delete('/api/sales/clear.php');
      if (data.success) {
        setShowConfirm(false);
        alert('All sales records have been cleared.');
        fetchSales();
      } else {
        alert('Error: ' + (data.error || 'Clear failed'));
      }
    } catch (err) {
      alert(err.message || 'Network Error');
    }
  };

  const handleExportCSV = () => {
    window.location.href = `/api/sales/export.php?start_date=${dates.start}&end_date=${dates.end}`;
  };

  return (
    <div className="sales-content">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '26px', fontWeight: '800', marginBottom: '4px', letterSpacing: '-0.5px' }}>Sales Reports</h1>
          <p style={{ color: 'var(--slate-500)', fontSize: '14px', fontWeight: '500' }}>Comprehensive overview of your business performance</p>
        </div>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <button 
            onClick={handleClearAll}
            className="premium-btn" 
            style={{ background: 'var(--danger-light)', color: 'var(--danger)', border: 'none', padding: '0 20px', height: '44px', fontSize: '13px', fontWeight: '700', borderRadius: '12px' }}
          >
            <svg style={{ width: '18px', height: '18px', marginRight: '8px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            CLEAR ALL RECORDS
          </button>

          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', background: 'white', padding: '10px 20px', borderRadius: '14px', boxShadow: 'var(--card-shadow)', border: '1px solid var(--border-main)' }}>
             <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '11px', fontWeight: '700', color: 'var(--slate-400)', textTransform: 'uppercase' }}>From</span>
                <input type="date" className="input-field" value={dates.start} onChange={(e) => setDates({ ...dates, start: e.target.value })} style={{ border: 'none', background: 'var(--slate-50)', height: '36px', width: '130px', padding: '0 8px', fontSize: '13px', borderRadius: '8px', fontWeight: '600' }} />
             </div>
             <div style={{ color: 'var(--slate-200)', fontWeight: 'bold' }}>→</div>
             <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '11px', fontWeight: '700', color: 'var(--slate-400)', textTransform: 'uppercase' }}>To</span>
                <input type="date" className="input-field" value={dates.end} onChange={(e) => setDates({ ...dates, end: e.target.value })} style={{ border: 'none', background: 'var(--slate-50)', height: '36px', width: '130px', padding: '0 8px', fontSize: '13px', borderRadius: '8px', fontWeight: '600' }} />
             </div>
          </div>
        </div>
      </div>

      <StatsCards totalSales={totalSales} totalOrders={transactions.length} />

      <div className="premium-card" style={{ padding: 0, overflow: 'hidden', boxShadow: 'var(--card-shadow-md)' }}>
        <div style={{ padding: '24px', borderBottom: '1px solid var(--border-main)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--slate-50)' }}>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-main)' }}>Transaction History</h3>
              <p style={{ fontSize: '12px', color: 'var(--slate-500)' }}>Showing all sales from {new Date(dates.start).toLocaleDateString()} to {new Date(dates.end).toLocaleDateString()}</p>
            </div>
            <button onClick={handleExportCSV} className="premium-btn" style={{ background: 'white', color: 'var(--slate-700)', border: '1px solid var(--border-main)', padding: '0 16px', height: '40px', fontSize: '13px', fontWeight: '600', boxShadow: 'none' }}>
               <svg style={{ width: '18px', height: '18px', marginRight: '8px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
               </svg>
               Export CSV
            </button>
        </div>
         <TransactionTable transactions={transactions} loading={loading} />
      </div>

      <ConfirmModal 
        show={showConfirm}
        onClose={() => setShowConfirm(false)}
        onCancel={() => setShowConfirm(false)}
        onConfirm={handleConfirmClear}
        title="Clear All Sales Records?"
        message="Are you absolutely sure you want to delete ALL sales records? This action cannot be undone and will reset your dashboard stats."
      />
    </div>
  );
};

export default SalesReport;
