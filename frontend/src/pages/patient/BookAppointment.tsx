import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { doctorAPI, appointmentAPI, patientAPI } from '../../services/api';
import type { Doctor } from '../../types';

const BookAppointment = () => {
  const { user } = useAuth();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fetchingDoctors, setFetchingDoctors] = useState(true);

  useEffect(() => {
    doctorAPI.getAll()
      .then(res => setDoctors(res.data.data ?? []))
      .catch(err => console.error('Fetch doctors error:', err))
      .finally(() => setFetchingDoctors(false));
  }, []);

  const handleBook = async () => {
    setError('');
    if (!selectedDoctor || !date || !time) {
      setError('Please fill all fields'); return;
    }
    setLoading(true);
    try {
      // Get the patient's own profile to get patient_id
      const profileRes = await patientAPI.getMyProfile();
      const patient_id = profileRes.data.data?.patient_id;
      if (!patient_id) throw new Error('Could not determine patient profile');

      await appointmentAPI.book({
        patient_id,
        doctor_id: selectedDoctor.doctor_id,
        appointment_date: date,
        appointment_time: time + ':00',
      });
      setSuccess(true);
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(message || 'Failed to book appointment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div style={{ padding: '2rem', maxWidth: '500px', textAlign: 'center', color: '#fff' }}>
        <div style={{ fontSize: '3rem' }}>✅</div>
        <h2 style={{ color: '#2db87a' }}>Appointment Booked!</h2>
        <p style={{ color: '#6b7f72' }}>
          With {selectedDoctor?.name} on {date} at {time}
        </p>
        <button
          onClick={() => { setSuccess(false); setSelectedDoctor(null); setDate(''); setTime(''); }}
          style={{
            background: '#2db87a', color: '#fff', border: 'none',
            padding: '0.7rem 1.5rem', borderRadius: '8px', cursor: 'pointer', fontWeight: 600,
          }}
        >
          Book Another
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '700px', color: '#fff' }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 700, margin: '0 0 0.25rem' }}>Book Appointment</h1>
      <p style={{ color: '#6b7f72', marginBottom: '2rem' }}>Select a doctor, date, and time</p>

      {/* Doctor selection */}
      <section style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1rem', fontWeight: 600, color: '#9ca3af', marginBottom: '1rem' }}>Choose Doctor</h2>
        {fetchingDoctors ? (
          <p style={{ color: '#6b7f72' }}>Loading doctors...</p>
        ) : doctors.length === 0 ? (
          <p style={{ color: '#6b7f72' }}>No doctors available.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {doctors.map(doc => (
              <div
                key={doc.doctor_id}
                onClick={() => setSelectedDoctor(doc)}
                style={{
                  border: `2px solid ${selectedDoctor?.doctor_id === doc.doctor_id ? '#2db87a' : '#1e2d22'}`,
                  borderRadius: '12px', padding: '1rem 1.25rem',
                  cursor: 'pointer', background: selectedDoctor?.doctor_id === doc.doctor_id ? '#1a2e22' : '#141f18',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  transition: 'all 0.15s',
                }}
              >
                <div>
                  <p style={{ fontWeight: 600, color: '#fff', margin: 0 }}>{doc.name}</p>
                  <p style={{ color: '#6b7f72', fontSize: '0.82rem', margin: '0.2rem 0 0' }}>
                    {doc.specialization} {doc.department_name ? `· ${doc.department_name}` : ''}
                  </p>
                </div>
                {selectedDoctor?.doctor_id === doc.doctor_id && (
                  <span style={{ color: '#2db87a', fontSize: '1.2rem' }}>✓</span>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Date & Time */}
      <section style={{
        background: '#141f18', border: '1px solid #1e2d22',
        borderRadius: '12px', padding: '1.5rem', marginBottom: '1.5rem',
      }}>
        <h2 style={{ fontSize: '1rem', fontWeight: 600, color: '#9ca3af', marginBottom: '1rem' }}>
          Select Date & Time
        </h2>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '160px', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 500, color: '#9ca3af' }}>Date</label>
            <input
              type="date" value={date}
              min={new Date().toISOString().split('T')[0]}
              onChange={e => setDate(e.target.value)}
              style={{ background: '#0f1a14', border: '1px solid #1e2d22', borderRadius: '8px', padding: '0.65rem 0.9rem', fontSize: '0.9rem', color: '#fff', outline: 'none' }}
            />
          </div>
          <div style={{ flex: 1, minWidth: '160px', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 500, color: '#9ca3af' }}>Time</label>
            <select
              value={time} onChange={e => setTime(e.target.value)}
              style={{ background: '#0f1a14', border: '1px solid #1e2d22', borderRadius: '8px', padding: '0.65rem 0.9rem', fontSize: '0.9rem', color: '#fff' }}
            >
              <option value="">Select time</option>
              {['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '14:00', '14:30', '15:00', '15:30', '16:00'].map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {error && (
        <div style={{
          marginBottom: '1rem', background: '#2a1515', border: '1px solid #5a2020',
          borderRadius: '8px', padding: '0.75rem', color: '#f87171', fontSize: '0.82rem',
        }}>
          {error}
        </div>
      )}

      <button
        onClick={handleBook} disabled={loading}
        style={{
          background: '#2db87a', color: '#fff', border: 'none',
          padding: '0.85rem 2rem', borderRadius: '10px',
          fontWeight: 700, fontSize: '1rem', cursor: 'pointer', width: '100%',
          opacity: loading ? 0.7 : 1,
        }}
      >
        {loading ? 'Booking...' : 'Confirm Appointment'}
      </button>
      {user && <p style={{ fontSize: '0.75rem', color: '#4a6355', marginTop: '0.5rem', textAlign: 'center' }}>Logged in as: {user.email}</p>}
    </div>
  );
};

export default BookAppointment;
