import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const patientLinks = [
  { to: '/patient/dashboard', label: 'Dashboard' },
  { to: '/patient/appointments', label: 'Appointments'},
  { to: '/patient/book', label: 'Book Appointment'},
  { to: '/patient/records', label: 'Medical Records'},
  { to: '/patient/prescriptions', label: 'Prescriptions'},
  { to: '/patient/billing', label: 'Billing'},
];

const doctorLinks = [
  { to: '/doctor/dashboard', label: 'Dashboard'},
  { to: '/doctor/appointments', label: 'Appointments'},
  { to: '/doctor/patients', label: 'My Patients' },
  { to: '/doctor/prescribe', label: 'Prescribe'},
  { to: '/doctor/reports', label: 'Upload Reports'},
  { to: '/doctor/billing', label: 'Create Bill'},
  { to: '/doctor/bills', label: 'View Bills'},
];

const Sidebar = () => {
  const { user } = useAuth();
  const links = user?.role === 'doctor' ? doctorLinks : patientLinks;

  return (
    <aside className="sidebar">
      <p className="sidebar-heading">
        Menu
      </p>
      <nav className="sidebar-nav">
        {links.map(link => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
