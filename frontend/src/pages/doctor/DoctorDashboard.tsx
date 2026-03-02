import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { appointmentAPI } from '../../services/api';
import { useNavigate } from 'react-router-dom';
import type { Appointment } from '../../types';

const DoctorDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    appointmentAPI.getDoctor()
      .then(res => setAppointments(res.data.data ?? []))
      .catch(err => console.error('Fetch doctor appointments error:', err))
      .finally(() => setLoading(false));
  }, []);

  const pending = appointments.filter(a => a.status === 'Pending');
  const confirmed = appointments.filter(a => a.status === 'Confirmed');
  const today = new Date().toISOString().split('T')[0];
  const todayApps = appointments.filter(a => a.appointment_date === today);

  const stats = [
    { label: 'Total Appointments', value: appointments.length, icon: '📅', color: '#1a2e22', accent: '#2db87a' },
    { label: 'Confirmed', value: confirmed.length, icon: '✅', color: '#1a2e22', accent: '#60a5fa' },
    { label: 'Pending', value: pending.length, icon: '⏳', color: '#2a2010', accent: '#f59e0b' },
    { label: "Today's", value: todayApps.length, icon: '🗓️', color: '#1a1a2e', accent: '#a78bfa' },
  ];

  return (
    <div style={{ padding: '2rem', maxWidth: '900px', color: '#fff' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, margin: 0 }}>
          Welcome, {user?.name || user?.email} 👨‍⚕️
        </h1>
        <p style={{ color: '#6b7f72', margin: '0.25rem 0 0' }}>Here's your schedule overview</p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        {stats.map(s => (
          <div key={s.label} style={{
            background: s.color, borderRadius: '12px', padding: '1.25rem',
            border: `1px solid ${s.accent}33`,
          }}>
            <div style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>{s.icon}</div>
            <div style={{ fontSize: '2rem', fontWeight: 700, color: s.accent }}>
              {loading ? '—' : s.value}
            </div>
            <div style={{ fontSize: '0.82rem', color: '#6b7f72', marginTop: '0.2rem' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Pending appointments */}
      <div style={{ background: '#141f18', borderRadius: '12px', border: '1px solid #1e2d22', padding: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 600, color: '#fff', margin: 0 }}>Pending Approvals</h2>
          <button
            onClick={() => navigate('/doctor/appointments')}
            style={{ background: 'transparent', border: 'none', color: '#2db87a', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600 }}
          >
            View All →
          </button>
        </div>
        {loading ? (
          <p style={{ color: '#6b7f72', textAlign: 'center', padding: '2rem' }}>Loading...</p>
        ) : pending.length === 0 ? (
          <p style={{ color: '#6b7f72', textAlign: 'center', padding: '2rem' }}>No pending appointments 🎉</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {pending.map(a => (
              <div key={a.appointment_id} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '0.75rem 1rem', background: '#2a2010', borderRadius: '8px',
                border: '1px solid #4a3a1044',
              }}>
                <div>
                  <p style={{ margin: 0, fontWeight: 500, color: '#fff', fontSize: '0.875rem' }}>{a.patient_name}</p>
                  <p style={{ margin: 0, fontSize: '0.78rem', color: '#6b7f72' }}>{a.appointment_date} · {a.appointment_time}</p>
                </div>
                <span style={{ background: '#3a2a10', color: '#f59e0b', padding: '0.2rem 0.6rem', borderRadius: '99px', fontSize: '0.72rem', fontWeight: 600 }}>
                  Pending
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorDashboard;
