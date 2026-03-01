import { useState } from 'react';
import { mockPatient, mockAppointments } from '../../utils/mockData';

const WritePrescription = () => {
  const [form, setForm] = useState({
    patient_id: '',
    diagnosis: '',
    prescription: '',
    test_reports: '',
  });
  const [success, setSuccess] = useState(false);

  const update = (key: string, val: string) => setForm(f => ({ ...f, [key]: val }));

  const handleSubmit = () => {
    if (!form.patient_id || !form.diagnosis || !form.prescription) {
      alert('Please fill all required fields'); return;
    }
    // TODO: Replace with real API call
    // await axios.post('/api/medical-records', { ...form, doctor_id });
    setSuccess(true);
  };

  if (success) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', maxWidth: '500px' }}>
        <div style={{ fontSize: '3rem' }}>✅</div>
        <h2 style={{ color: '#276749' }}>Prescription Saved!</h2>
        <button
          onClick={() => { setSuccess(false); setForm({ patient_id: '', diagnosis: '', prescription: '', test_reports: '' }); }}
          style={{ background: '#1a4a7a', color: '#fff', border: 'none', padding: '0.7rem 1.5rem', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}
        >
          Write Another
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '650px' }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1a202c', marginBottom: '0.25rem' }}>
        Write Prescription
      </h1>
      <p style={{ color: '#718096', marginBottom: '2rem' }}>Create a medical record for a patient</p>

      <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {/* Patient select */}
        <Field label="Select Patient *">
          <select
            value={form.patient_id} onChange={e => update('patient_id', e.target.value)}
            style={inputStyle}
          >
            <option value="">Choose patient</option>
            <option value={mockPatient.patient_id}>{mockPatient.name}</option>
          </select>
        </Field>

        {/* Appointment reference */}
        <Field label="Related Appointment">
          <select style={inputStyle}>
            <option value="">Select appointment (optional)</option>
            {mockAppointments.filter(a => a.status === 'Confirmed').map(a => (
              <option key={a.appointment_id} value={a.appointment_id}>
                {a.patient_name} · {a.appointment_date} {a.appointment_time}
              </option>
            ))}
          </select>
        </Field>

        {/* Diagnosis */}
        <Field label="Diagnosis *">
          <input
            type="text" placeholder="e.g. Hypertension Stage 1"
            value={form.diagnosis} onChange={e => update('diagnosis', e.target.value)}
            style={inputStyle}
          />
        </Field>

        {/* Prescription */}
        <Field label="Prescription *">
          <textarea
            rows={4} placeholder="Medicine name, dosage, frequency..."
            value={form.prescription} onChange={e => update('prescription', e.target.value)}
            style={{ ...inputStyle, resize: 'vertical' }}
          />
        </Field>

        {/* Test reports */}
        <Field label="Test Reports / Notes">
          <textarea
            rows={3} placeholder="Lab results, observations..."
            value={form.test_reports} onChange={e => update('test_reports', e.target.value)}
            style={{ ...inputStyle, resize: 'vertical' }}
          />
        </Field>

        <button
          onClick={handleSubmit}
          style={{ background: '#1a4a7a', color: '#fff', border: 'none', padding: '0.85rem', borderRadius: '10px', fontWeight: 700, fontSize: '1rem', cursor: 'pointer' }}
        >
          Save Prescription
        </button>
      </div>
    </div>
  );
};

const inputStyle: React.CSSProperties = {
  border: '1px solid #e2e8f0', borderRadius: '8px',
  padding: '0.65rem 0.9rem', fontSize: '0.875rem', outline: 'none', width: '100%',
  boxSizing: 'border-box',
};

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
    <label style={{ fontSize: '0.85rem', fontWeight: 500, color: '#4a5568' }}>{label}</label>
    {children}
  </div>
);

export default WritePrescription;