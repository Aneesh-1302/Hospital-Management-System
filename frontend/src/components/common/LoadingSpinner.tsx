const LoadingSpinner = ({ message = 'Loading...' }: { message?: string }) => (
  <div style={{
    display: 'flex', flexDirection: 'column',
    alignItems: 'center', justifyContent: 'center',
    padding: '3rem', gap: '1rem',
  }}>
    <div style={{
      width: '40px', height: '40px',
      border: '4px solid #e2e8f0',
      borderTop: '4px solid #1a4a7a',
      borderRadius: '50%',
      animation: 'spin 0.8s linear infinite',
    }} />
    <p style={{ color: '#718096', fontSize: '0.875rem' }}>{message}</p>
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
  </div>
);

export default LoadingSpinner;