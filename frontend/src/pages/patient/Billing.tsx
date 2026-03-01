import BillCard from '../../components/patient/BillCard';
import { mockBills } from '../../utils/mockData';

const Billing = () => {
  const total = mockBills.reduce((sum, b) => sum + b.total_amount, 0);
  const unpaid = mockBills.filter(b => b.payment_status !== 'Paid').reduce((sum, b) => sum + b.total_amount, 0);

  return (
    <div style={{ padding: '2rem', maxWidth: '750px' }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1a202c', marginBottom: '0.25rem' }}>
        Billing
      </h1>
      <p style={{ color: '#718096', marginBottom: '1.5rem' }}>Your billing history & payments</p>

      {/* Summary */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        <SummaryCard label="Total Billed" value={`₹${total}`} color="#ebf8ff" accent="#2b6cb0" />
        <SummaryCard label="Pending"      value={`₹${unpaid}`} color="#fff5f5" accent="#9b2c2c" />
        <SummaryCard label="Bills"        value={`${mockBills.length}`} color="#f0fff4" accent="#276749" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
        {mockBills.map(b => <BillCard key={b.bill_id} bill={b} />)}
      </div>
    </div>
  );
};

const SummaryCard = ({ label, value, color, accent }: { label: string; value: string; color: string; accent: string }) => (
  <div style={{
    background: color, borderRadius: '12px', padding: '1rem 1.5rem',
    flex: 1, minWidth: '140px', border: `1px solid ${accent}22`,
  }}>
    <p style={{ margin: 0, fontSize: '0.78rem', color: '#718096' }}>{label}</p>
    <p style={{ margin: '0.25rem 0 0', fontSize: '1.5rem', fontWeight: 700, color: accent }}>{value}</p>
  </div>
);

export default Billing;