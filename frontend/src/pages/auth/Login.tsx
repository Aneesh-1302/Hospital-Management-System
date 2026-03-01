import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import type { UserRole } from '../../types';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [role, setRole]         = useState<UserRole>('patient');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);

  const handleSubmit = async () => {
    setError('');
    setLoading(true);
    try {
      await login(email, password, role);
      navigate(role === 'doctor' ? '/doctor/dashboard' : '/patient/dashboard');
    } catch {
      setError('Invalid credentials. Try patient@test.com or doctor@test.com');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh', background: '#0f1a14',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '2rem', fontFamily: "'Segoe UI', sans-serif",
    }}>
      {/* Left branding panel */}
      <div style={{
        display: 'none',
        flex: 1, maxWidth: '480px', padding: '3rem',
        color: '#fff',
      }} className="left-panel">
      </div>

      {/* Card */}
      <div style={{
        background: '#141f18', border: '1px solid #1e2d22',
        borderRadius: '20px', padding: '2.5rem',
        width: '100%', maxWidth: '420px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem' }}>
          <span style={{ color: '#2db87a', fontSize: '1.3rem' }}>♥</span>
          <span style={{ color: '#fff', fontWeight: 700, fontSize: '1.1rem' }}>SmartCare</span>
        </div>

        <h1 style={{ color: '#fff', fontSize: '1.6rem', fontWeight: 700, margin: '0 0 0.4rem' }}>
          Welcome back
        </h1>
        <p style={{ color: '#6b7f72', fontSize: '0.875rem', margin: '0 0 2rem' }}>
          Sign in to your account
        </p>

        {/* Role toggle */}
        <div style={{
          display: 'flex', background: '#0f1a14',
          borderRadius: '10px', padding: '4px', marginBottom: '1.5rem',
          border: '1px solid #1e2d22',
        }}>
          {(['patient', 'doctor'] as UserRole[]).map(r => (
            <button key={r} onClick={() => setRole(r)} style={{
              flex: 1, padding: '0.5rem', border: 'none', borderRadius: '7px', cursor: 'pointer',
              background: role === r ? '#2db87a' : 'transparent',
              color: role === r ? '#fff' : '#6b7f72',
              fontWeight: role === r ? 600 : 400, fontSize: '0.875rem',
              transition: 'all 0.2s',
            }}>
              {r === 'patient' ? '👤 Patient' : '👨‍⚕️ Doctor'}
            </button>
          ))}
        </div>

        {/* Fields */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <DarkField label="Email" type="email" value={email} onChange={setEmail} placeholder="you@example.com" />
          <DarkField label="Password" type="password" value={password} onChange={setPassword} placeholder="••••••••" />
        </div>

        {error && (
          <div style={{
            marginTop: '1rem', background: '#2a1515', border: '1px solid #5a2020',
            borderRadius: '8px', padding: '0.75rem', color: '#f87171', fontSize: '0.82rem',
          }}>
            {error}
          </div>
        )}

        <button
          onClick={handleSubmit} disabled={loading}
          style={{
            marginTop: '1.5rem', width: '100%',
            background: '#2db87a', border: 'none', color: '#fff',
            padding: '0.85rem', borderRadius: '10px',
            fontWeight: 700, fontSize: '1rem', cursor: 'pointer',
            opacity: loading ? 0.7 : 1,
            transition: 'background 0.2s',
          }}
          onMouseEnter={e => !loading && (e.currentTarget.style.background = '#25a06a')}
          onMouseLeave={e => (e.currentTarget.style.background = '#2db87a')}
        >
          {loading ? 'Signing in...' : 'Sign In'}
        </button>

        {/* Hint */}
        <div style={{
          marginTop: '1rem', background: '#0f1a14', border: '1px solid #1e2d22',
          borderRadius: '8px', padding: '0.65rem 0.9rem', fontSize: '0.78rem', color: '#4a6355',
        }}>
          Demo → patient@test.com &nbsp;|&nbsp; doctor@test.com &nbsp;(any password)
        </div>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem', color: '#6b7f72' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: '#2db87a', fontWeight: 600, textDecoration: 'none' }}>Register</Link>
        </p>
      </div>
    </div>
  );
};

const DarkField = ({ label, type, value, onChange, placeholder }: {
  label: string; type: string; value: string;
  onChange: (v: string) => void; placeholder: string;
}) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
    <label style={{ fontSize: '0.8rem', fontWeight: 500, color: '#9ca3af' }}>{label}</label>
    <input
      type={type} value={value} placeholder={placeholder}
      onChange={e => onChange(e.target.value)}
      style={{
        background: '#0f1a14', border: '1px solid #1e2d22', borderRadius: '8px',
        padding: '0.7rem 0.9rem', fontSize: '0.9rem', color: '#fff', outline: 'none',
      }}
      onFocus={e => (e.target.style.borderColor = '#2db87a')}
      onBlur={e  => (e.target.style.borderColor = '#1e2d22')}
    />
  </div>
);

export default Login;