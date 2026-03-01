import { mockMedicalRecords, mockPatient } from '../../utils/mockData';

const MedicalRecords = () => (
  <div style={{ padding: '2rem', maxWidth: '750px' }}>
    <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1a202c', marginBottom: '0.25rem' }}>
      Medical Records
    </h1>
    <p style={{ color: '#718096', marginBottom: '1.5rem' }}>Your complete health history</p>

    {/* Patient summary card */}
    <div style={{
      background: 'linear-gradient(135deg, #0a2540, #1a4a7a)',
      borderRadius: '12px', padding: '1.5rem', color: '#fff', marginBottom: '2rem',
      display: 'flex', gap: '2rem', flexWrap: 'wrap',
    }}>
      {[
        { label: 'Name',         value: mockPatient.name },
        { label: 'Blood Group',  value: mockPatient.blood_group },
        { label: 'Age',          value: `${mockPatient.age} yrs` },
        { label: 'Gender',       value: mockPatient.gender },
      ].map(item => (
        <div key={item.label}>
          <p style={{ margin: 0, fontSize: '0.75rem', color: '#94b8d8' }}>{item.label}</p>
          <p style={{ margin: '0.2rem 0 0', fontWeight: 600 }}>{item.value}</p>
        </div>
      ))}
    </div>

    {/* Medical history note */}
    {mockPatient.medical_history && (
      <div style={{
        background: '#fffbeb', border: '1px solid #f6e05e',
        borderRadius: '10px', padding: '1rem 1.25rem', marginBottom: '1.5rem',
        fontSize: '0.875rem', color: '#744210',
      }}>
        📝 <strong>Medical History:</strong> {mockPatient.medical_history}
      </div>
    )}

    {/* Records */}
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {mockMedicalRecords.map(r => (
        <div key={r.record_id} style={{
          background: '#fff', border: '1px solid #e2e8f0',
          borderLeft: '4px solid #1a4a7a', borderRadius: '12px', padding: '1.25rem 1.5rem',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <span style={{ fontWeight: 600, color: '#1a202c' }}>{r.diagnosis}</span>
            <span style={{ fontSize: '0.78rem', color: '#a0aec0' }}>{r.created_at}</span>
          </div>
          <p style={{ fontSize: '0.82rem', color: '#718096', margin: '0 0 0.75rem' }}>👨‍⚕️ {r.doctor_name}</p>
          <div style={{ background: '#f7fafc', borderRadius: '8px', padding: '0.75rem', fontSize: '0.875rem', color: '#4a5568', marginBottom: '0.5rem' }}>
            <strong>💊 Prescription:</strong> {r.prescription}
          </div>
          {r.test_reports && (
            <div style={{ background: '#ebf8ff', borderRadius: '8px', padding: '0.75rem', fontSize: '0.875rem', color: '#2b6cb0' }}>
              <strong>🧪 Reports:</strong> {r.test_reports}
            </div>
          )}
        </div>
      ))}
    </div>
  </div>
);

export default MedicalRecords;