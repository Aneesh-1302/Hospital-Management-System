import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();
  return (
    <div style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '2rem',
      background: '#f7fafc',
    }}>
      <div style={{ fontSize: '5rem', marginBottom: '1rem' }}>🏥</div>
      <h1 style={{ fontSize: '4rem', fontWeight: 800, color: '#1a4a7a', margin: 0 }}>404</h1>
      <p style={{ color: '#718096', fontSize: '1.1rem', margin: '0.5rem 0 2rem' }}>
        This page doesn't exist or you don't have access.
      </p>
      <button
        onClick={() => navigate('/')}
        style={{
          background: '#1a4a7a', color: '#fff', border: 'none',
          padding: '0.85rem 2rem', borderRadius: '10px',
          fontWeight: 700, fontSize: '1rem', cursor: 'pointer',
        }}
      >
        Go Home
      </button>
    </div>
  );
};

export default NotFound;