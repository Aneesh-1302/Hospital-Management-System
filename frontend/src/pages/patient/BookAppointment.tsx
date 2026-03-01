import { useState } from 'react';
import { mockDoctors } from '../../utils/mockData';
import type { Doctor } from '../../types';

const BookAppointment = () => {
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [date, setDate]   = useState('');
  const [time, setTime]   = useState('');
  const [success, setSuccess] = useState(false);

  const handleBook = () => {
    if (!selectedDoctor || !date || !time) {
      alert('Please fill all fields'); return;
    }
    // TODO: Replace with real API call
    // await axios.post('/api/appointments', { patient_id, doctor_id: selectedDoctor.doctor_id, appointment_date: date, appointment_time: time });
    setSuccess(true);
  };

  if (success) {
    return (
      <div style={{ padding: '2rem', maxWidth: '500px', textAlign: 'center' }}>
        <div style={{ fontSize: '3rem' }}>✅</div>
        <h2 style={{ color: '#276749' }}>Appointment Booked!</h2>
        <p style={{ color: '#718096' }}>
          With {selectedDoctor?.name} on {date} at {time}
        </p>
        <button
          onClick={() => { setSuccess(false); setSelectedDoctor(null); setDate(''); setTime(''); }}
          style={{
            background: '#1a4a7a', color: '#fff', border: 'none',
            padding: '0.7rem 1.5rem', borderRadius: '8px', cursor: 'pointer', fontWeight: 600,
          }}
        >
          Book Another
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '700px' }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1a202c', marginBottom: '0.25rem' }}>
        Book Appointment
      </h1>
      <p style={{ color: '#718096', marginBottom: '2rem' }}>Select a doctor, date, and time</p>

      {/* Doctor selection */}
      <section style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1rem', fontWeight: 600, color: '#4a5568', marginBottom: '1rem' }}>
          Choose Doctor
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {mockDoctors.map(doc => (
            <div
              key={doc.doctor_id}
              onClick={() => setSelectedDoctor(doc)}
              style={{
                border: `2px solid ${selectedDoctor?.doctor_id === doc.doctor_id ? '#1a4a7a' : '#e2e8f0'}`,
                borderRadius: '12px', padding: '1rem 1.25rem',
                cursor: 'pointer', background: selectedDoctor?.doctor_id === doc.doctor_id ? '#ebf8ff' : '#fff',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                transition: 'all 0.15s',
              }}
            >
              <div>
                <p style={{ fontWeight: 600, color: '#1a202c', margin: 0 }}>{doc.name}</p>
                <p style={{ color: '#718096', fontSize: '0.82rem', margin: '0.2rem 0 0' }}>
                  {doc.specialization} · {doc.department_name}
                </p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ color: '#4a5568', fontSize: '0.8rem', margin: 0 }}>🕐 {doc.availability}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Date & Time */}
      <section style={{
        background: '#fff', border: '1px solid #e2e8f0',
        borderRadius: '12px', padding: '1.5rem', marginBottom: '1.5rem',
      }}>
        <h2 style={{ fontSize: '1rem', fontWeight: 600, color: '#4a5568', marginBottom: '1rem' }}>
          Select Date & Time
        </h2>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '160px', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 500, color: '#4a5568' }}>Date</label>
            <input
              type="date" value={date}
              min={new Date().toISOString().split('T')[0]}
              onChange={e => setDate(e.target.value)}
              style={{ border: '1px solid #e2e8f0', borderRadius: '8px', padding: '0.65rem 0.9rem', fontSize: '0.9rem', outline: 'none' }}
            />
          </div>
          <div style={{ flex: 1, minWidth: '160px', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 500, color: '#4a5568' }}>Time</label>
            <select
              value={time} onChange={e => setTime(e.target.value)}
              style={{ border: '1px solid #e2e8f0', borderRadius: '8px', padding: '0.65rem 0.9rem', fontSize: '0.9rem' }}
            >
              <option value="">Select time</option>
              {['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '14:00', '14:30', '15:00', '15:30', '16:00'].map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
        </div>
      </section>

      <button
        onClick={handleBook}
        style={{
          background: '#1a4a7a', color: '#fff', border: 'none',
          padding: '0.85rem 2rem', borderRadius: '10px',
          fontWeight: 700, fontSize: '1rem', cursor: 'pointer', width: '100%',
        }}
      >
        Confirm Appointment
      </button>
    </div>
  );
};

export default BookAppointment;