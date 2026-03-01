import type { Bill } from '../../types';

interface Props { bill: Bill }

const BillCard = ({ bill }: Props) => {
  const isPaid = bill.payment_status === 'Paid';

  return (
    <div style={{
      background: '#fff',
      border: '1px solid #e2e8f0',
      borderRadius: '12px',
      padding: '1.5rem',
      boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <span style={{ fontWeight: 600, color: '#1a202c' }}>Bill #{bill.bill_id}</span>
        <span style={{
          background: isPaid ? '#f0fff4' : '#fff5f5',
          color: isPaid ? '#276749' : '#9b2c2c',
          padding: '0.2rem 0.65rem',
          borderRadius: '99px',
          fontSize: '0.75rem',
          fontWeight: 600,
        }}>
          {bill.payment_status}
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.875rem', color: '#4a5568' }}>
        <Row label="Consultation" amount={bill.consultation_charges} />
        <Row label="Lab Charges"  amount={bill.lab_charges} />
        <Row label="Medicines"    amount={bill.medicine_charges} />
        <hr style={{ border: 'none', borderTop: '1px solid #e2e8f0', margin: '0.5rem 0' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, color: '#1a202c' }}>
          <span>Total</span>
          <span>₹{bill.total_amount}</span>
        </div>
      </div>

      {!isPaid && (
        <button style={{
          marginTop: '1rem',
          width: '100%',
          background: '#1a4a7a',
          color: '#fff',
          border: 'none',
          padding: '0.6rem',
          borderRadius: '8px',
          cursor: 'pointer',
          fontWeight: 600,
          fontSize: '0.875rem',
        }}>
          Pay Now
        </button>
      )}
    </div>
  );
};

const Row = ({ label, amount }: { label: string; amount: number }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
    <span>{label}</span>
    <span>₹{amount}</span>
  </div>
);

export default BillCard;