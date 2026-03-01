import { useNavigate } from 'react-router-dom';
import type { Patient } from '../../types';

interface Props { patient: Patient }

const PatientCard = ({ patient }: Props) => {
  const navigate = useNavigate();

  return (
    <div style={{
      background: '#fff',
      border: '1px solid #e2e8f0',
      borderRadius: '12px',
      padding: '1.25rem 1.5rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
      transition: 'box-shadow 0.2s',
    }}
    onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.1)')}
    onMouseLeave={e => (e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.05)')}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{
          width: '44px', height: '44px',
          background: '#ebf8ff',
          borderRadius: '50%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '1.25rem',
        }}>👤</div>
        <div>
          <p style={{ fontWeight: 600, color: '#1a202c', margin: 0 }}>{patient.name}</p>
          <p style={{ color: '#718096', fontSize: '0.8rem', margin: '0.15rem 0 0' }}>
            {patient.age} yrs · {patient.gender} · 🩸 {patient.blood_group}
          </p>
        </div>
      </div>

      <button
        onClick={() => navigate(`/doctor/patients/${patient.patient_id}`)}
        style={{
          background: '#1a4a7a',
          color: '#fff',
          border: 'none',
          padding: '0.4rem 1rem',
          borderRadius: '8px',
          cursor: 'pointer',
          fontSize: '0.8rem',
          fontWeight: 500,
        }}
      >
        View Details
      </button>
    </div>
  );
};

export default PatientCard;