import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import type { UserRole } from '../../types';

const Register = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState<UserRole>('patient');
  const [form, setForm] = useState({
    name: '', email: '', password: '', confirmPassword: '',
    age: '', gender: '', contact: '', address: '', blood_group: '',
    specialization: '',
  });
  const [error, setError] = useState('');

  const update = (key: string, val: string) => setForm(f => ({ ...f, [key]: val }));

  const handleSubmit = () => {
    if (form.password !== form.confirmPassword) { setError('Passwords do not match'); return; }
    if (!form.name || !form.email || !form.password) { setError('Please fill all required fields'); return; }
    // TODO: await axios.post('/api/auth/register', { ...form, role });
    alert('Registered successfully! Please login.');
    navigate('/login');
  };

  return (
    <div style={{
      minHeight: '100vh', background: '#0f1a14',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '2rem', fontFamily: "'Segoe UI', sans-serif",
    }}>
      <div style={{
        background: '#141f18', border: '1px solid #1e2d22',
        borderRadius: '20px', padding: '2.5rem',
        width: '100%', maxWidth: '520px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
          <span style={{ color: '#2db87a', fontSize: '1.3rem' }}>♥</span>
          <span style={{ color: '#fff', fontWeight: 700, fontSize: '1.1rem' }}>SmartCare</span>
        </div>

        <h1 style={{ color: '#fff', fontSize: '1.6rem', fontWeight: 700, margin: '0 0 0.4rem' }}>Create account</h1>
        <p style={{ color: '#6b7f72', fontSize: '0.875rem', margin: '0 0 1.5rem' }}>Join SmartCare today</p>

        {/* Role toggle */}
        <div style={{
          display: 'flex', background: '#0f1a14', borderRadius: '10px',
          padding: '4px', marginBottom: '1.5rem', border: '1px solid #1e2d22',
        }}>
          {(['patient', 'doctor'] as UserRole[]).map(r => (
            <button key={r} onClick={() => setRole(r)} style={{
              flex: 1, padding: '0.5rem', border: 'none', borderRadius: '7px', cursor: 'pointer',
              background: role === r ? '#2db87a' : 'transparent',
              color: role === r ? '#fff' : '#6b7f72',
              fontWeight: role === r ? 600 : 400, fontSize: '0.875rem',
            }}>
              {r === 'patient' ? '👤 Patient' : '👨‍⚕️ Doctor'}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
          <TwoCol>
            <DarkField label="Full Name *"  value={form.name}    onChange={v => update('name', v)}    placeholder="John Doe" />
            <DarkField label="Email *"      value={form.email}   onChange={v => update('email', v)}   placeholder="you@example.com" type="email" />
          </TwoCol>
          <TwoCol>
            <DarkField label="Password *"         value={form.password}        onChange={v => update('password', v)}        placeholder="••••••••" type="password" />
            <DarkField label="Confirm Password *" value={form.confirmPassword} onChange={v => update('confirmPassword', v)} placeholder="••••••••" type="password" />
          </TwoCol>
          <TwoCol>
            <DarkField label="Contact" value={form.contact} onChange={v => update('contact', v)} placeholder="9876543210" />
            <DarkField label="Age"     value={form.age}     onChange={v => update('age', v)}     placeholder="22" type="number" />
          </TwoCol>

          {role === 'patient' && (
            <TwoCol>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: 500, color: '#9ca3af' }}>Gender</label>
                <select value={form.gender} onChange={e => update('gender', e.target.value)} style={selectStyle}>
                  <option value="">Select</option>
                  <option>Male</option><option>Female</option><option>Other</option>
                </select>
              </div>
              <DarkField label="Blood Group" value={form.blood_group} onChange={v => update('blood_group', v)} placeholder="O+" />
            </TwoCol>
          )}

          {role === 'doctor' && (
            <DarkField label="Specialization" value={form.specialization} onChange={v => update('specialization', v)} placeholder="Cardiologist" />
          )}

          <DarkField label="Address" value={form.address} onChange={v => update('address', v)} placeholder="123, MG Road, Bangalore" />
        </div>

        {error && (
          <div style={{
            marginTop: '0.75rem', background: '#2a1515', border: '1px solid #5a2020',
            borderRadius: '8px', padding: '0.7rem', color: '#f87171', fontSize: '0.82rem',
          }}>
            {error}
          </div>
        )}

        <button onClick={handleSubmit} style={{
          marginTop: '1.5rem', width: '100%',
          background: '#2db87a', border: 'none', color: '#fff',
          padding: '0.85rem', borderRadius: '10px',
          fontWeight: 700, fontSize: '1rem', cursor: 'pointer',
        }}
        onMouseEnter={e => (e.currentTarget.style.background = '#25a06a')}
        onMouseLeave={e => (e.currentTarget.style.background = '#2db87a')}
        >
          Create Account
        </button>

        <p style={{ textAlign: 'center', marginTop: '1.25rem', fontSize: '0.875rem', color: '#6b7f72' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#2db87a', fontWeight: 600, textDecoration: 'none' }}>Sign In</Link>
        </p>
      </div>
    </div>
  );
};

const TwoCol = ({ children }: { children: React.ReactNode }) => (
  <div style={{ display: 'flex', gap: '0.75rem' }}>{children}</div>
);

const DarkField = ({ label, type = 'text', value, onChange, placeholder }: {
  label: string; type?: string; value: string;
  onChange: (v: string) => void; placeholder: string;
}) => (
  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
    <label style={{ fontSize: '0.8rem', fontWeight: 500, color: '#9ca3af' }}>{label}</label>
    <input
      type={type} value={value} placeholder={placeholder}
      onChange={e => onChange(e.target.value)}
      style={{
        background: '#0f1a14', border: '1px solid #1e2d22', borderRadius: '8px',
        padding: '0.65rem 0.85rem', fontSize: '0.875rem', color: '#fff', outline: 'none',
        width: '100%', boxSizing: 'border-box',
      }}
      onFocus={e => (e.target.style.borderColor = '#2db87a')}
      onBlur={e  => (e.target.style.borderColor = '#1e2d22')}
    />
  </div>
);

const selectStyle: React.CSSProperties = {
  background: '#0f1a14', border: '1px solid #1e2d22', borderRadius: '8px',
  padding: '0.65rem 0.85rem', fontSize: '0.875rem', color: '#fff', outline: 'none', width: '100%',
};

export default Register;