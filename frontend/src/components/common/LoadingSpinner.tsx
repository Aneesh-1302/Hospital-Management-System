const LoadingSpinner = ({ message = 'Loading...' }: { message?: string }) => (
  <div style={{
    display: 'flex', flexDirection: 'column',
    alignItems: 'center', justifyContent: 'center',
    padding: '3rem', gap: '1rem',
  }}>
    <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
      {[0, 1, 2, 3].map(i => (
        <div key={i} style={{
          width: '4px', height: '24px',
          background: 'var(--brand-primary)',
          animation: `pulse 0.8s ease-in-out ${i * 0.15}s infinite`,
        }} />
      ))}
    </div>
    <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{message}</p>
    <style>{`@keyframes pulse { 0%, 100% { opacity: 0.3; transform: scaleY(0.6); } 50% { opacity: 1; transform: scaleY(1); } }`}</style>
  </div>
);

export default LoadingSpinner;
