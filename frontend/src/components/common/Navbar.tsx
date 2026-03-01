import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <nav style={{
      background: '#0f1a14', borderBottom: '1px solid #1e2d22',
      padding: '0 2rem', height: '60px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      position: 'sticky', top: 0, zIndex: 100,
    }}>
      <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <span style={{ color: '#2db87a', fontSize: '1.2rem' }}>♥</span>
        <span style={{ color: '#fff', fontWeight: 700, fontSize: '1rem' }}>SmartCare</span>
      </Link>

      {user && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <span style={{
            background: '#1a2e22', border: '1px solid #2db87a44',
            color: '#2db87a', padding: '0.25rem 0.75rem',
            borderRadius: '99px', fontSize: '0.75rem', fontWeight: 600,
            textTransform: 'capitalize',
          }}>
            {user.role}
          </span>
          <span style={{ color: '#9ca3af', fontSize: '0.875rem' }}>{user.name}</span>
          <button
            onClick={handleLogout}
            style={{
              background: 'transparent', border: '1px solid #1e2d22',
              color: '#9ca3af', padding: '0.4rem 1rem', borderRadius: '8px',
              cursor: 'pointer', fontSize: '0.82rem', transition: 'all 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#2db87a'; e.currentTarget.style.color = '#2db87a'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = '#1e2d22'; e.currentTarget.style.color = '#9ca3af'; }}
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;