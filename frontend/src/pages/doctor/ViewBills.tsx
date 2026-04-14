import { useState, useEffect } from 'react';
import { billingAPI } from '../../services/api';
import type { Bill } from '../../types';

const ViewBills = () => {
  const [bills, setBills] = useState<Bill[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    billingAPI.getDoctor()
      .then(res => setBills(res.data.data ?? []))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const paid = bills.filter(b => b.payment_status === 'Paid').length;
  const pending = bills.filter(b => b.payment_status !== 'Paid').length;

  return (
    <div className="dashboard-container">
      <h1 className="page-title">Bills Overview</h1>
      <p className="page-subtitle">Track patient payment status</p>

      {/* Summary */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        {[
          { label: 'Total Bills', value: bills.length,  color: '#3b82f6' },
          { label: 'Paid',        value: paid,           color: '#16a34a' },
          { label: 'Pending',     value: pending,        color: '#dc2626' },
        ].map(s => (
          <div key={s.label} style={{
            background: '#fff', borderRadius: '14px', padding: '1.25rem 1.5rem',
            border: '1px solid #e2e8f0', flex: 1, minWidth: '140px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
          }}>
            <p style={{ margin: 0, fontSize: '0.78rem', color: '#94a3b8', textTransform: 'uppercase' as const }}>{s.label}</p>
            <p style={{ margin: '0.25rem 0 0', fontSize: '1.75rem', fontWeight: 700, color: s.color }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Bills table */}
      {loading ? (
        <p style={{ color: 'var(--text-muted)' }}>Loading...</p>
      ) : bills.length === 0 ? (
        <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '3rem' }}>No bills found.</p>
      ) : (
        <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ background: '#f8faff', borderBottom: '1px solid #e2e8f0' }}>
                {['Bill #', 'Patient', 'Consultation', 'Lab', 'Medicine', 'Total', 'Status', 'Date'].map(h => (
                  <th key={h} style={{ padding: '0.85rem 1rem', textAlign: 'left', fontWeight: 600, color: '#64748b', fontSize: '0.78rem', textTransform: 'uppercase' as const }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {bills.map((b, i) => (
                <tr key={b.bill_id} style={{ borderBottom: i < bills.length - 1 ? '1px solid #f1f5f9' : 'none', transition: 'background 0.15s' }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#f8faff')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  <td style={{ padding: '0.85rem 1rem', fontWeight: 600, color: '#0f172a' }}>#{b.bill_id}</td>
                  <td style={{ padding: '0.85rem 1rem', color: '#334155' }}>{(b as any).patient_name || `Patient #${b.patient_id}`}</td>
                  <td style={{ padding: '0.85rem 1rem', color: '#475569' }}>₹{b.consultation_charges}</td>
                  <td style={{ padding: '0.85rem 1rem', color: '#475569' }}>₹{b.lab_charges}</td>
                  <td style={{ padding: '0.85rem 1rem', color: '#475569' }}>₹{b.medicine_charges}</td>
                  <td style={{ padding: '0.85rem 1rem', fontWeight: 700, color: '#0f172a' }}>₹{b.total_amount}</td>
                  <td style={{ padding: '0.85rem 1rem' }}>
                    <span style={{
                      background: b.payment_status === 'Paid' ? '#f0fdf4' : '#fef2f2',
                      color: b.payment_status === 'Paid' ? '#16a34a' : '#dc2626',
                      border: `1px solid ${b.payment_status === 'Paid' ? '#bbf7d0' : '#fecaca'}`,
                      padding: '0.2rem 0.65rem', borderRadius: '99px',
                      fontSize: '0.72rem', fontWeight: 600,
                    }}>
                      {b.payment_status}
                    </span>
                  </td>
                  <td style={{ padding: '0.85rem 1rem', color: '#94a3b8', fontSize: '0.78rem' }}>{b.issued_date?.toString().split('T')[0]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ViewBills;