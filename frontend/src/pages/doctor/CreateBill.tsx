import { useState, useEffect } from 'react';
import { appointmentAPI, billingAPI } from '../../services/api';
import type { Appointment } from '../../types';

const CreateBill = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedAppt, setSelectedAppt] = useState<Appointment | null>(null);
  const [form, setForm] = useState({
    consultation_charges: '',
    lab_charges: '',
    medicine_charges: '',
  });
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    appointmentAPI.getDoctor()
      .then(res => {
        const completed = (res.data.data ?? []).filter(a => a.status === 'Completed');
        setAppointments(completed);
      });
  }, []);

  const total =
    (parseFloat(form.consultation_charges) || 0) +
    (parseFloat(form.lab_charges) || 0) +
    (parseFloat(form.medicine_charges) || 0);

  const handleSubmit = async () => {
    if (!selectedAppt) {
        setError('Please select an appointment');
        return;
    }

    try {
        // 1️⃣ mark completed
        await appointmentAPI.updateStatus(selectedAppt.appointment_id, "Completed");

        // 2️⃣ create bill
        await billingAPI.create({
        patient_id: selectedAppt.patient_id,
        appointment_id: selectedAppt.appointment_id,
        consultation_charges: parseFloat(form.consultation_charges) || 0,
        lab_charges: parseFloat(form.lab_charges) || 0,
        medicine_charges: parseFloat(form.medicine_charges) || 0,
        });

        setSuccess(true);
    } catch (err) {
        setError("Failed to generate bill");
    }
  };

  if (success) return (
    <div className="dashboard-container" style={{ textAlign: 'center', padding: '4rem' }}>
      <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✅</div>
      <h2 style={{ color: '#16a34a' }}>Bill Created Successfully!</h2>
      <p style={{ color: '#64748b', margin: '0.5rem 0 2rem' }}>
        Total: ₹{total} for {selectedAppt?.patient_name}
      </p>
      <button className="btn-primary" onClick={() => { setSuccess(false); setSelectedAppt(null); setForm({ consultation_charges: '', lab_charges: '', medicine_charges: '' }); }}>
        Create Another Bill
      </button>
    </div>
  );

  return (
    <div className="dashboard-container">
      <h1 className="page-title">Create Bill</h1>
      <p className="page-subtitle">Generate a bill for a completed appointment</p>

      {/* Select appointment */}
      <div className="dashboard-section" style={{ marginBottom: '1.5rem' }}>
        <h2 className="dashboard-section-title" style={{ marginBottom: '1rem' }}>Select Appointment</h2>
        {appointments.length === 0 ? (
          <p style={{ color: 'var(--text-muted)' }}>No completed appointments found.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {appointments.map(a => (
              <div key={a.appointment_id}
                onClick={async () => {
                  setSelectedAppt(a);
                  await appointmentAPI.updateStatus(a.appointment_id, "Completed");
                }}
                className="list-item"
                style={{
                  cursor: 'pointer',
                  border: `2px solid ${selectedAppt?.appointment_id === a.appointment_id ? 'var(--brand-primary)' : 'var(--border-color)'}`,
                  background: selectedAppt?.appointment_id === a.appointment_id ? 'var(--bg-hover)' : 'var(--bg-main)',
                }}
              >
                <div>
                  <p style={{ margin: 0, fontWeight: 600, color: 'var(--text-primary)' }}>{a.patient_name}</p>
                  <p style={{ margin: '0.15rem 0 0', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    {a.appointment_date} · {a.appointment_time}
                  </p>
                </div>
                {selectedAppt?.appointment_id === a.appointment_id && (
                  <span style={{ color: 'var(--brand-primary)', fontWeight: 600 }}>✓ Selected</span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Charges form */}
      <div className="dashboard-section">
        <h2 className="dashboard-section-title" style={{ marginBottom: '1.5rem' }}>Enter Charges</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
          {[
            { key: 'consultation_charges', label: 'Consultation Charges (₹)' },
            { key: 'lab_charges',          label: 'Lab Charges (₹)' },
            { key: 'medicine_charges',     label: 'Medicine Charges (₹)' },
          ].map(f => (
            <div key={f.key} className="form-group">
              <label className="form-label">{f.label}</label>
              <input
                type="number" min="0"
                value={form[f.key as keyof typeof form]}
                onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                className="form-control"
                placeholder="0.00"
              />
            </div>
          ))}
        </div>

        {/* Total preview */}
        <div style={{
          background: 'var(--bg-main)', border: '1px solid var(--border-color)',
          borderRadius: '10px', padding: '1rem 1.5rem',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          marginBottom: '1.5rem',
        }}>
          <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Total Amount</span>
          <span style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--brand-primary)' }}>₹{total.toFixed(2)}</span>
        </div>

        {error && <div className="auth-error" style={{ marginBottom: '1rem' }}>{error}</div>}

        <button
          onClick={handleSubmit} disabled={loading || !selectedAppt}
          className="btn-primary"
          style={{ width: '100%', padding: '0.85rem', fontSize: '1rem', opacity: (!selectedAppt || loading) ? 0.6 : 1 }}
        >
          {loading ? 'Creating Bill...' : 'Generate Bill'}
        </button>
      </div>
    </div>
  );
};

export default CreateBill;