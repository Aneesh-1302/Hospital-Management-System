import { useState } from 'react';
import { billingAPI } from '../../services/api';
import type { Bill } from '../../types';

interface Props { bill: Bill }

const BillCard = ({ bill }: Props) => {
  const [status, setStatus] = useState(bill.payment_status);
  const [loading, setLoading] = useState(false);

  const isPaid = status === 'Paid';

  const handlePay = async () => {
    setLoading(true);
    try {
      await billingAPI.updatePaymentStatus(bill.bill_id, 'Paid');
      setStatus('Paid');
    } catch (err) {
      console.error('Payment error:', err);
      alert('Failed to update payment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      background: '#ffffff', border: '1px solid #e2e8f0',
      borderRadius: '16px', padding: '1.5rem',
      boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
        <div>
          <span style={{ fontWeight: 700, color: '#0f172a', fontSize: '1rem' }}>Bill #{bill.bill_id}</span>
          {bill.issued_date && (
            <p style={{ margin: '0.15rem 0 0', fontSize: '0.75rem', color: '#94a3b8' }}>{bill.issued_date}</p>
          )}
        </div>
        <span style={{
          background: isPaid ? '#f0fdf4' : '#fef2f2',
          color: isPaid ? '#16a34a' : '#dc2626',
          border: `1px solid ${isPaid ? '#bbf7d0' : '#fecaca'}`,
          padding: '0.25rem 0.75rem', borderRadius: '99px',
          fontSize: '0.75rem', fontWeight: 600,
        }}>
          {status}
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem' }}>
        {[
          { label: 'Consultation', amount: bill.consultation_charges },
          { label: 'Lab Charges',  amount: bill.lab_charges },
          { label: 'Medicines',    amount: bill.medicine_charges },
        ].map(item => (
          <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', color: '#475569' }}>
            <span>{item.label}</span>
            <span>₹{item.amount}</span>
          </div>
        ))}
        <hr style={{ border: 'none', borderTop: '1px solid #e2e8f0', margin: '0.5rem 0' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, color: '#0f172a', fontSize: '1rem' }}>
          <span>Total</span>
          <span>₹{bill.total_amount}</span>
        </div>
      </div>

      {!isPaid && (
        <button
          onClick={handlePay}
          disabled={loading}
          style={{
            marginTop: '1.25rem', width: '100%',
            background: loading ? '#94a3b8' : 'linear-gradient(135deg, #3b82f6, #2563eb)',
            color: '#fff', border: 'none',
            padding: '0.7rem', borderRadius: '10px',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontWeight: 600, fontSize: '0.875rem',
            boxShadow: '0 4px 12px rgba(59,130,246,0.3)',
          }}
        >
          {loading ? 'Processing...' : '💳 Pay Now'}
        </button>
      )}

      {isPaid && (
        <div style={{ marginTop: '1rem', textAlign: 'center', color: '#16a34a', fontWeight: 600, fontSize: '0.875rem' }}>
          ✅ Payment Complete
        </div>
      )}
    </div>
  );
};

export default BillCard;