import { useAuth } from '../../context/AuthContext';
import { mockAppointments } from '../../utils/mockData';
import { useNavigate } from 'react-router-dom';

const DoctorDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const pending   = mockAppointments.filter(a => a.status === 'Pending');
  const confirmed = mockAppointments.filter(a => a.status === 'Confirmed');
  const today     = new Date().toISOString().split('T')[0];
  const todayApps = mockAppointments.filter(a => a.appointment_date === today);

  const stats = [
    { label: 'Total Appointments', value: mockAppointments.length, icon: '📅', color: '#ebf8ff', accent: '#2b6cb0' },
    { label: 'Confirmed',          value: confirmed.length,        icon: '✅', color: '#f0fff4', accent: '#276749' },
    { label: 'Pending',            value: pending.length,          icon: '⏳', color: '#fffbeb', accent: '#92400e' },
    { label: "Today's",            value: todayApps.length,        icon: '🗓️', color: '#faf5ff', accent: '#6b46c1' },
  ];

  return (
    <div style={{ padding: '2rem', maxWidth: '900px' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#1a202c', margin: 0 }}>
          Welcome, {user?.name} 👨‍⚕️
        </h1>
        <p style={{ color: '#718096', margin: '0.25rem 0 0' }}>Here's your schedule overview</p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        {stats.map(s => (
          <div key={s.label} style={{
            background: s.color, borderRadius: '12px', padding: '1.25rem',
            border: `1px solid ${s.accent}22`,
          }}>
            <div style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>{s.icon}</div>
            <div style={{ fontSize: '2rem', fontWeight: 700, color: s.accent }}>{s.value}</div>
            <div style={{ fontSize: '0.82rem', color: '#718096', marginTop: '0.2rem' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Pending appointments */}
      <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 600, color: '#1a202c', margin: 0 }}>Pending Approvals</h2>
          <button
            onClick={() => navigate('/doctor/appointments')}
            style={{ background: 'transparent', border: 'none', color: '#1a4a7a', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600 }}
          >
            View All →
          </button>
        </div>
        {pending.length === 0 ? (
          <p style={{ color: '#a0aec0', textAlign: 'center', padding: '2rem' }}>No pending appointments 🎉</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {pending.map(a => (
              <div key={a.appointment_id} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '0.75rem 1rem', background: '#fffbeb', borderRadius: '8px',
                border: '1px solid #fef08a',
              }}>
                <div>
                  <p style={{ margin: 0, fontWeight: 500, color: '#1a202c', fontSize: '0.875rem' }}>{a.patient_name}</p>
                  <p style={{ margin: 0, fontSize: '0.78rem', color: '#718096' }}>{a.appointment_date} · {a.appointment_time}</p>
                </div>
                <span style={{ background: '#fef9c3', color: '#92400e', padding: '0.2rem 0.6rem', borderRadius: '99px', fontSize: '0.72rem', fontWeight: 600 }}>
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