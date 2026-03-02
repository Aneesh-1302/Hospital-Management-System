import { useState, useEffect } from 'react';
import BillCard from '../../components/patient/BillCard';
import { billingAPI } from '../../services/api';
import type { Bill } from '../../types';

const Billing = () => {
  const [bills, setBills] = useState<Bill[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    billingAPI.getMy()
      .then(res => setBills(res.data.data ?? []))
      .catch(err => console.error('Fetch bills error:', err))
      .finally(() => setLoading(false));
  }, []);

  const total = bills.reduce((sum, b) => sum + b.total_amount, 0);
  const unpaid = bills.filter(b => b.payment_status !== 'Paid').reduce((sum, b) => sum + b.total_amount, 0);

  return (
    <div style={{ padding: '2rem', maxWidth: '750px', color: '#fff' }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 700, margin: '0 0 0.25rem' }}>Billing</h1>
      <p style={{ color: '#6b7f72', marginBottom: '1.5rem' }}>Your billing history & payments</p>

      {/* Summary */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        <SummaryCard label="Total Billed" value={`₹${total}`} color="#1a2e22" accent="#2db87a" />
        <SummaryCard label="Pending" value={`₹${unpaid}`} color="#2a1515" accent="#f87171" />
        <SummaryCard label="Bills" value={`${bills.length}`} color="#141f18" accent="#60a5fa" />
      </div>

      {loading ? (
        <p style={{ color: '#6b7f72' }}>Loading billing data...</p>
      ) : bills.length === 0 ? (
        <p style={{ color: '#6b7f72', textAlign: 'center', padding: '3rem' }}>No bills found.</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
          {bills.map(b => <BillCard key={b.bill_id} bill={b} />)}
        </div>
      )}
    </div>
  );
};

const SummaryCard = ({ label, value, color, accent }: { label: string; value: string; color: string; accent: string }) => (
  <div style={{
    background: color, borderRadius: '12px', padding: '1rem 1.5rem',
    flex: 1, minWidth: '140px', border: `1px solid ${accent}33`,
  }}>
    <p style={{ margin: 0, fontSize: '0.78rem', color: '#6b7f72' }}>{label}</p>
    <p style={{ margin: '0.25rem 0 0', fontSize: '1.5rem', fontWeight: 700, color: accent }}>{value}</p>
  </div>
);

export default Billing;
