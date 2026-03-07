import { useEffect, useState, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { appointmentAPI, billingAPI, patientAPI } from '../../services/api';
import { useNavigate } from 'react-router-dom';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import type { Appointment, Bill, Patient } from '../../types';
import { formatDate, formatDisplayName } from '../../utils/format';

const PatientDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [bills, setBills] = useState<Bill[]>([]);
  const [profile, setProfile] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);

  useScrollReveal([loading]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [apptRes, billRes, profileRes] = await Promise.all([
          appointmentAPI.getMy(),
          billingAPI.getMy(),
          patientAPI.getMyProfile(),
        ]);
        setAppointments(apptRes.data.data ?? []);
        setBills(billRes.data.data ?? []);
        setProfile(profileRes.data.data ?? null);
      } catch (err) {
        console.error('Dashboard load error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // ─── Memoized derived state ────────────────────────────────────────────────
  // Recomputed only when the source arrays change, not on every render
  const upcoming = useMemo(
    () => appointments.filter(a => a.status !== 'Cancelled'),
    [appointments]
  );
  const unpaidBills = useMemo(
    () => bills.filter(b => b.payment_status !== 'Paid'),
    [bills]
  );
  const stats = useMemo(
    () => [
      { label: 'Appointments', value: upcoming.length, icon: '📅', path: '/patient/appointments', accent: 'var(--brand-primary)' },
      { label: 'Medical Records', value: 0, icon: '📋', path: '/patient/records', accent: '#3b82f6' },
      { label: 'Pending Bills', value: unpaidBills.length, icon: '💳', path: '/patient/billing', accent: '#f87171' },
      { label: 'Prescriptions', value: 0, icon: '💊', path: '/patient/prescriptions', accent: '#a78bfa' },
    ],
    [upcoming.length, unpaidBills.length]
  );


  // ─── Memoized display name ─────────────────────────────────────────────────
  const displayName = useMemo(
    () => formatDisplayName(profile?.name || user?.name, user?.email).split(' ')[0],
    [profile?.name, user?.name, user?.email]
  );

  if (loading) return <Spinner />;

  return (
    <div className="dashboard-container">
      {/* Greeting */}
      <div className="dashboard-header">
        <h1 className="dashboard-greeting reveal">
          Good day, <span title={user?.email || ''} style={{ cursor: 'help', borderBottom: '1px dashed var(--border-color)' }}>
            {displayName}
          </span> 👋
        </h1>
        {profile && (
          <p className="dashboard-profile-info reveal delay-1">
            Blood Group: <span style={{ color: 'var(--brand-primary)', fontWeight: 600 }}>{profile.blood_group || '—'}</span>
            &nbsp;&middot;&nbsp;{profile.age ? `${profile.age} yrs` : '—'} &middot; {profile.gender || '—'}
          </p>
        )}
      </div>

      {/* Stat cards */}
      <div className="stats-grid">
        {stats.map((s, i: number) => (
          <div
            key={s.label} onClick={() => navigate(s.path)}
            className={`stat-card reveal-scale delay-${i + 2}`}
          >
            <div style={{ fontSize: '1.5rem', marginBottom: '0.75rem' }}>{s.icon}</div>
            <div style={{ fontSize: '2rem', fontWeight: 700, color: s.accent }}>{s.value}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Recent appointments */}
      <div className="dashboard-section reveal delay-6">
        <div className="dashboard-section-header">
          <h2 className="dashboard-section-title">Recent Appointments</h2>
          <button
            onClick={() => navigate('/patient/book')}
            className="btn-primary"
            style={{ padding: '0.4rem 1rem', fontSize: '0.8rem' }}
          >
            + Book New
          </button>
        </div>
        {appointments.length === 0 ? (
          <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem' }}>No appointments yet. Book your first one!</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {appointments.slice(0, 3).map((a: Appointment, i: number) => (
              <div key={a.appointment_id} className={`list-item reveal delay-${i + 7}`}>
                <div>
                  <p style={{ margin: 0, fontWeight: 500, fontSize: '0.875rem' }}>{a.doctor_name}</p>
                  <p style={{ margin: '0.15rem 0 0', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    {formatDate(a.appointment_date)} &middot; {a.appointment_time}
                  </p>
                </div>
                <StatusBadge status={a.status} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const StatusBadge = ({ status }: { status: string }) => {
  const colors: Record<string, { bg: string; color: string }> = {
    Confirmed: { bg: 'var(--bg-hover)', color: 'var(--brand-primary)' },
    Pending: { bg: '#2a2010', color: '#f59e0b' },
    Cancelled: { bg: '#2a1515', color: '#f87171' },
    Completed: { bg: '#1a2e22', color: '#60a5fa' },
  };
  const c = colors[status] ?? colors.Pending;
  return (
    <span className="badge" style={{
      background: c.bg, color: c.color, border: `1px solid ${c.color}44`,
    }}>
      {status}
    </span>
  );
};

const Spinner = () => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
    <div style={{ color: 'var(--brand-primary)', fontSize: '1rem' }}>Loading...</div>
  </div>
);

export default PatientDashboard;
