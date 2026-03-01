import { useParams, useNavigate } from 'react-router-dom';
import { mockPatient, mockMedicalRecords, mockAppointments } from '../../utils/mockData';

const PatientDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // In real app: fetch patient by id from API
  const patient = mockPatient; // using mock since we only have one
  const records = mockMedicalRecords.filter(r => r.patient_id === Number(id) || true);
  const appointments = mockAppointments.filter(a => a.patient_id === Number(id) || true);

  return (
    <div style={{ padding: '2rem', maxWidth: '800px' }}>
      <button
        onClick={() => navigate(-1)}
        style={{ background: 'none', border: 'none', color: '#1a4a7a', cursor: 'pointer', fontSize: '0.875rem', marginBottom: '1rem', padding: 0 }}
      >
        ← Back
      </button>

      {/* Patient header */}
      <div style={{
        background: 'linear-gradient(135deg, #0a2540, #1a4a7a)',
        borderRadius: '12px', padding: '1.5rem', color: '#fff', marginBottom: '1.5rem',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            width: '56px', height: '56px', background: 'rgba(255,255,255,0.15)',
            borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem',
          }}>👤</div>
          <div>
            <h2 style={{ margin: 0, fontSize: '1.25rem' }}>{patient.name}</h2>
            <p style={{ margin: '0.25rem 0 0', color: '#94b8d8', fontSize: '0.85rem' }}>
              {patient.age} yrs · {patient.gender} · 🩸 {patient.blood_group}
            </p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '2rem' }}>
          <div><p style={{ margin: 0, fontSize: '0.75rem', color: '#94b8d8' }}>Contact</p><p style={{ margin: 0 }}>{patient.contact}</p></div>
          <div><p style={{ margin: 0, fontSize: '0.75rem', color: '#94b8d8' }}>Address</p><p style={{ margin: 0, fontSize: '0.85rem' }}>{patient.address}</p></div>
        </div>
      </div>

      {/* Medical history */}
      {patient.medical_history && (
        <div style={{ background: '#fffbeb', border: '1px solid #f6e05e', borderRadius: '10px', padding: '1rem', marginBottom: '1.5rem', fontSize: '0.875rem', color: '#744210' }}>
          📝 <strong>Medical History:</strong> {patient.medical_history}
        </div>
      )}

      {/* Records */}
      <h2 style={{ fontSize: '1rem', fontWeight: 600, color: '#4a5568', marginBottom: '1rem' }}>Medical Records</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
        {records.map(r => (
          <div key={r.record_id} style={{
            background: '#fff', border: '1px solid #e2e8f0', borderLeft: '4px solid #1a4a7a',
            borderRadius: '10px', padding: '1rem 1.25rem',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontWeight: 600, color: '#1a202c' }}>{r.diagnosis}</span>
              <span style={{ fontSize: '0.75rem', color: '#a0aec0' }}>{r.created_at}</span>
            </div>
            <p style={{ margin: '0.5rem 0 0', fontSize: '0.85rem', color: '#4a5568' }}>💊 {r.prescription}</p>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
        <button
          onClick={() => navigate('/doctor/prescribe')}
          style={{ background: '#1a4a7a', color: '#fff', border: 'none', padding: '0.7rem 1.5rem', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}
        >
          + Write Prescription
        </button>
        <button
          onClick={() => navigate('/doctor/reports')}
          style={{ background: '#f7fafc', color: '#4a5568', border: '1px solid #e2e8f0', padding: '0.7rem 1.5rem', borderRadius: '8px', cursor: 'pointer', fontWeight: 500 }}
        >
          Upload Report
        </button>
      </div>
    </div>
  );
};

export default PatientDetails;