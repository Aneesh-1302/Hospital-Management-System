import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const patientLinks = [
  { to: '/patient/dashboard',     label: 'Dashboard',        icon: '⊞' },
  { to: '/patient/appointments',  label: 'Appointments',     icon: '📅' },
  { to: '/patient/book',          label: 'Book Appointment', icon: '＋' },
  { to: '/patient/records',       label: 'Medical Records',  icon: '📋' },
  { to: '/patient/prescriptions', label: 'Prescriptions',    icon: '💊' },
  { to: '/patient/billing',       label: 'Billing',          icon: '💳' },
];

const doctorLinks = [
  { to: '/doctor/dashboard',     label: 'Dashboard',       icon: '⊞' },
  { to: '/doctor/appointments',  label: 'Appointments',    icon: '📅' },
  { to: '/doctor/patients',      label: 'My Patients',     icon: '👥' },
  { to: '/doctor/prescribe',     label: 'Prescribe',       icon: '💊' },
  { to: '/doctor/reports',       label: 'Upload Reports',  icon: '📁' },
];

const Sidebar = () => {
  const { user } = useAuth();
  const links = user?.role === 'doctor' ? doctorLinks : patientLinks;

  return (
    <aside style={{
      width: '220px', minHeight: 'calc(100vh - 60px)',
      background: '#0c1610', borderRight: '1px solid #1e2d22',
      padding: '1.5rem 0.75rem', flexShrink: 0,
    }}>
      <p style={{ color: '#4a6355', fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', padding: '0 0.75rem', marginBottom: '0.75rem' }}>
        Menu
      </p>
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
        {links.map(link => (
          <NavLink
            key={link.to}
            to={link.to}
            style={({ isActive }) => ({
              display: 'flex', alignItems: 'center', gap: '0.75rem',
              padding: '0.65rem 0.75rem', borderRadius: '10px',
              textDecoration: 'none', fontSize: '0.875rem',
              fontWeight: isActive ? 600 : 400,
              color: isActive ? '#2db87a' : '#9ca3af',
              background: isActive ? '#1a2e22' : 'transparent',
              transition: 'all 0.15s',
              border: isActive ? '1px solid #2db87a22' : '1px solid transparent',
            })}
            onMouseEnter={e => {
              if (!(e.currentTarget.style.color === 'rgb(45, 184, 122)'))
                e.currentTarget.style.color = '#fff';
            }}
            onMouseLeave={e => {
              if (!(e.currentTarget.style.background === 'rgb(26, 46, 34)'))
                e.currentTarget.style.color = '#9ca3af';
            }}
          >
            <span style={{ fontSize: '1rem', width: '18px', textAlign: 'center' }}>{link.icon}</span>
            {link.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;