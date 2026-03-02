import { useState, useEffect } from 'react';
import { patientAPI, appointmentAPI, medicalRecordAPI } from '../../services/api';
import type { Patient, Appointment } from '../../types';

const WritePrescription = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [form, setForm] = useState({
    patient_id: '',
    appointment_id: '',
    diagnosis: '',
    prescription: '',
    test_reports: '',
  });
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([patientAPI.getAll(), appointmentAPI.getDoctor()])
      .then(([pRes, aRes]) => {
        setPatients(pRes.data.data ?? []);
        setAppointments((aRes.data.data ?? []).filter(a => a.status === 'Confirmed'));
      })
      .catch(err => console.error('Load data error:', err));
  }, []);

  const update = (key: string, val: string) => setForm(f => ({ ...f, [key]: val }));

  const handleSubmit = async () => {
    setError('');
    if (!form.patient_id || !form.diagnosis || !form.prescription) {
      setError('Please fill all required fields'); return;
    }
    setLoading(true);
    try {
      await medicalRecordAPI.create({
        patient_id: parseInt(form.patient_id),
        appointment_id: form.appointment_id ? parseInt(form.appointment_id) : undefined,
        diagnosis: form.diagnosis,
        prescription: form.prescription,
        test_reports: form.test_reports || undefined,
      });
      setSuccess(true);
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(message || 'Failed to save prescription. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', maxWidth: '500px', color: '#fff' }}>
        <div style={{ fontSize: '3rem' }}>✅</div>
        <h2 style={{ color: '#2db87a' }}>Prescription Saved!</h2>
        <button
          onClick={() => { setSuccess(false); setForm({ patient_id: '', appointment_id: '', diagnosis: '', prescription: '', test_reports: '' }); }}
          style={{ background: '#2db87a', color: '#fff', border: 'none', padding: '0.7rem 1.5rem', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}
        >
          Write Another
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '650px', color: '#fff' }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 700, margin: '0 0 0.25rem' }}>Write Prescription</h1>
      <p style={{ color: '#6b7f72', marginBottom: '2rem' }}>Create a medical record for a patient</p>

      <div style={{ background: '#141f18', border: '1px solid #1e2d22', borderRadius: '12px', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {/* Patient select */}
        <Field label="Select Patient *">
          <select value={form.patient_id} onChange={e => update('patient_id', e.target.value)} style={inputStyle}>
            <option value="">Choose patient</option>
            {patients.map(p => (
              <option key={p.patient_id} value={p.patient_id}>{p.name}</option>
            ))}
          </select>
        </Field>

        {/* Appointment reference */}
        <Field label="Related Appointment">
          <select value={form.appointment_id} onChange={e => update('appointment_id', e.target.value)} style={inputStyle}>
            <option value="">Select appointment (optional)</option>
            {appointments.map(a => (
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

        {error && (
          <div style={{ background: '#2a1515', border: '1px solid #5a2020', borderRadius: '8px', padding: '0.7rem', color: '#f87171', fontSize: '0.82rem' }}>
            {error}
          </div>
        )}

        <button
          onClick={handleSubmit} disabled={loading}
          style={{ background: '#2db87a', color: '#fff', border: 'none', padding: '0.85rem', borderRadius: '10px', fontWeight: 700, fontSize: '1rem', cursor: 'pointer', opacity: loading ? 0.7 : 1 }}
        >
          {loading ? 'Saving...' : 'Save Prescription'}
        </button>
      </div>
    </div>
  );
};

const inputStyle: React.CSSProperties = {
  background: '#0f1a14', border: '1px solid #1e2d22', borderRadius: '8px',
  padding: '0.65rem 0.9rem', fontSize: '0.875rem', color: '#fff', outline: 'none', width: '100%',
  boxSizing: 'border-box',
};

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
    <label style={{ fontSize: '0.85rem', fontWeight: 500, color: '#9ca3af' }}>{label}</label>
    {children}
  </div>
);

export default WritePrescription;
