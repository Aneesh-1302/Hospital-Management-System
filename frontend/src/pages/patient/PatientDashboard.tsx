import { useAuth } from '../../context/AuthContext';
import { mockAppointments, mockBills, mockMedicalRecords, mockPatient } from '../../utils/mockData';
import { useNavigate } from 'react-router-dom';

const PatientDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const upcoming   = mockAppointments.filter(a => a.status !== 'Cancelled');
  const unpaidBills = mockBills.filter(b => b.payment_status === 'Unpaid');

  const stats = [
    { label: 'Appointments',    value: upcoming.length,           icon: '📅', path: '/patient/appointments', accent: '#2db87a' },
    { label: 'Medical Records', value: mockMedicalRecords.length, icon: '📋', path: '/patient/records',       accent: '#3b82f6' },
    { label: 'Pending Bills',   value: unpaidBills.length,        icon: '💳', path: '/patient/billing',       accent: '#f87171' },
    { label: 'Prescriptions',   value: mockMedicalRecords.length, icon: '💊', path: '/patient/prescriptions', accent: '#a78bfa' },
  ];

  return (
    <div style={{ padding: '2rem', maxWidth: '900px', color: '#fff' }}>
      {/* Greeting */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, margin: 0 }}>
          Good morning, {user?.name?.split(' ')[0]} 👋
        </h1>
        <p style={{ color: '#6b7f72', margin: '0.3rem 0 0', fontSize: '0.875rem' }}>
          Blood Group: <span style={{ color: '#2db87a', fontWeight: 600 }}>{mockPatient.blood_group}</span>
          &nbsp;·&nbsp;{mockPatient.age} yrs · {mockPatient.gender}
        </p>
      </div>

      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        {stats.map(s => (
          <div
            key={s.label} onClick={() => navigate(s.path)}
            style={{
              background: '#141f18', border: '1px solid #1e2d22',
              borderRadius: '14px', padding: '1.25rem', cursor: 'pointer',
              transition: 'border-color 0.2s, transform 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = s.accent + '66'; e.currentTarget.style.transform = 'translateY(-3px)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = '#1e2d22'; e.currentTarget.style.transform = 'none'; }}
          >
            <div style={{ fontSize: '1.5rem', marginBottom: '0.75rem' }}>{s.icon}</div>
            <div style={{ fontSize: '2rem', fontWeight: 700, color: s.accent }}>{s.value}</div>
            <div style={{ fontSize: '0.8rem', color: '#6b7f72', marginTop: '0.2rem' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Recent appointments */}
      <div style={{ background: '#141f18', border: '1px solid #1e2d22', borderRadius: '14px', padding: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 600, margin: 0 }}>Recent Appointments</h2>
          <button
            onClick={() => navigate('/patient/book')}
            style={{
              background: '#2db87a', border: 'none', color: '#fff',
              padding: '0.4rem 1rem', borderRadius: '8px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600,
            }}
          >
            + Book New
          </button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {mockAppointments.slice(0, 3).map(a => (
            <div key={a.appointment_id} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '0.85rem 1rem', background: '#0f1a14', borderRadius: '10px',
              border: '1px solid #1e2d22',
            }}>
              <div>
                <p style={{ margin: 0, fontWeight: 500, fontSize: '0.875rem' }}>{a.doctor_name}</p>
                <p style={{ margin: '0.15rem 0 0', fontSize: '0.78rem', color: '#6b7f72' }}>
                  {a.appointment_date} · {a.appointment_time}
                </p>
              </div>
              <StatusBadge status={a.status} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const StatusBadge = ({ status }: { status: string }) => {
  const colors: Record<string, { bg: string; color: string }> = {
    Confirmed: { bg: '#1a2e22', color: '#2db87a' },
    Pending:   { bg: '#2a2010', color: '#f59e0b' },
    Cancelled: { bg: '#2a1515', color: '#f87171' },
  };
  const c = colors[status] ?? colors.Pending;
  return (
    <span style={{
      background: c.bg, color: c.color, border: `1px solid ${c.color}44`,
      padding: '0.2rem 0.65rem', borderRadius: '99px',
      fontSize: '0.72rem', fontWeight: 600,
    }}>
      {status}
    </span>
  );
};

export default PatientDashboard;