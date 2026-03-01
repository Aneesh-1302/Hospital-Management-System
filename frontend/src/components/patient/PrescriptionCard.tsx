import type { MedicalRecord } from '../../types';

interface Props { record: MedicalRecord }

const PrescriptionCard = ({ record }: Props) => (
  <div style={{
    background: '#fff',
    border: '1px solid #e2e8f0',
    borderLeft: '4px solid #1a4a7a',
    borderRadius: '12px',
    padding: '1.25rem 1.5rem',
    boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <span style={{ fontWeight: 600, color: '#1a202c' }}>{record.diagnosis}</span>
      <span style={{ fontSize: '0.75rem', color: '#a0aec0' }}>{record.created_at}</span>
    </div>
    <p style={{ color: '#718096', fontSize: '0.85rem', margin: 0 }}>
      👨‍⚕️ {record.doctor_name}
    </p>
    <div style={{
      background: '#f7fafc',
      borderRadius: '8px',
      padding: '0.75rem 1rem',
      fontSize: '0.875rem',
      color: '#4a5568',
    }}>
      <strong>💊 Prescription:</strong> {record.prescription}
    </div>
    {record.test_reports && (
      <div style={{
        background: '#ebf8ff',
        borderRadius: '8px',
        padding: '0.75rem 1rem',
        fontSize: '0.875rem',
        color: '#2b6cb0',
      }}>
        <strong>🧪 Test Reports:</strong> {record.test_reports}
      </div>
    )}
  </div>
);

export default PrescriptionCard;