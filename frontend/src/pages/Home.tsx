import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div style={{ background: '#0f1a14', minHeight: '100vh', fontFamily: "'Segoe UI', sans-serif", color: '#fff' }}>

      {/* ── NAVBAR ── */}
      <nav style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '1.25rem 4rem', borderBottom: '1px solid #1e2d22',
        position: 'sticky', top: 0, background: '#0f1a14', zIndex: 100,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ color: '#2db87a', fontSize: '1.3rem' }}>♥</span>
          <span style={{ fontWeight: 700, fontSize: '1.15rem', letterSpacing: '-0.3px' }}>SmartCare</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '2.5rem' }}>
          <a href="#features" style={{ color: '#9ca3af', textDecoration: 'none', fontSize: '0.9rem' }}>Features</a>
          <a href="#about"    style={{ color: '#9ca3af', textDecoration: 'none', fontSize: '0.9rem' }}>About</a>
          <button onClick={() => navigate('/login')} style={{
            background: 'none', border: 'none', color: '#fff',
            fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer',
          }}>Sign In</button>
          <button onClick={() => navigate('/register')} style={{
            background: '#2db87a', border: 'none', color: '#fff',
            padding: '0.55rem 1.3rem', borderRadius: '8px',
            fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer',
          }}
          onMouseEnter={e => (e.currentTarget.style.background = '#25a06a')}
          onMouseLeave={e => (e.currentTarget.style.background = '#2db87a')}
          >Get Started</button>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '5rem 4rem 4rem', gap: '3rem', flexWrap: 'wrap',
        minHeight: '85vh',
      }}>
        {/* Left */}
        <div style={{ flex: '1 1 420px', maxWidth: '560px' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
            border: '1px solid #2db87a55', borderRadius: '99px',
            padding: '0.3rem 1rem', marginBottom: '2rem',
            color: '#2db87a', fontSize: '0.8rem', fontWeight: 500,
          }}>
            <span>🛡</span> Trusted by 500+ hospitals
          </div>

          <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 3.8rem)', fontWeight: 800, lineHeight: 1.1, margin: '0 0 1.5rem' }}>
            Smart Hospital<br />
            <span style={{ color: '#2db87a' }}>Management</span><br />
            System
          </h1>

          <p style={{ color: '#9ca3af', fontSize: '1rem', lineHeight: 1.7, maxWidth: '440px', marginBottom: '2.5rem' }}>
            Digitize your hospital operations. Manage appointments, medical records,
            billing, and prescriptions — all in one secure platform.
          </p>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <button onClick={() => navigate('/register')} style={{
              background: '#2db87a', border: 'none', color: '#fff',
              padding: '0.85rem 2rem', borderRadius: '10px',
              fontWeight: 700, fontSize: '1rem', cursor: 'pointer',
            }}>Register Now</button>
            <button onClick={() => navigate('/login')} style={{
              background: 'transparent', border: '1.5px solid #3a3a3a', color: '#fff',
              padding: '0.85rem 2rem', borderRadius: '10px',
              fontWeight: 600, fontSize: '1rem', cursor: 'pointer',
            }}>Sign In</button>
          </div>
        </div>

        {/* Right card */}
        <div style={{
          flex: '1 1 360px', maxWidth: '600px',
          borderRadius: '20px', overflow: 'hidden',
          background: 'linear-gradient(135deg, #1a2e22 0%, #0d1f16 100%)',
          border: '1px solid #1e3326',
          minHeight: '380px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          position: 'relative',
        }}>
          <div style={{ textAlign: 'center', padding: '3rem', position: 'relative', zIndex: 1 }}>
            <div style={{ fontSize: '5rem', marginBottom: '1rem' }}>🏥</div>
            <p style={{ color: '#2db87a', fontWeight: 600, fontSize: '1.1rem', margin: '0 0 0.4rem' }}>SmartCare HMS</p>
            <p style={{ color: '#4a6355', fontSize: '0.85rem', margin: 0 }}>Your health, digitized.</p>
          </div>
          <div style={{
            position: 'absolute', width: '200px', height: '200px',
            background: '#2db87a22', borderRadius: '50%',
            filter: 'blur(60px)', top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)', pointerEvents: 'none',
          }} />
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" style={{ padding: '5rem 4rem', background: '#0c1610' }}>
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <h2 style={{ fontSize: '2.2rem', fontWeight: 700, margin: '0 0 1rem' }}>Everything You Need</h2>
          <p style={{ color: '#9ca3af', fontSize: '1rem', maxWidth: '520px', margin: '0 auto' }}>
            A comprehensive platform for patients and doctors to manage healthcare efficiently.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
          {[
            { icon: '📅', title: 'Appointment Management', desc: 'Book, reschedule, or cancel appointments with ease. View doctor availability in real-time.' },
            { icon: '🛡️', title: 'Secure Medical Records',  desc: 'Access your complete medical history, prescriptions, and test reports securely.' },
            { icon: '💳', title: 'Billing & Payments',       desc: 'View itemized bills, track payment status, and manage consultation charges.' },
          ].map(f => (
            <div key={f.title} style={{
              background: '#141f18', border: '1px solid #1e2d22',
              borderRadius: '16px', padding: '2rem',
              transition: 'border-color 0.2s, transform 0.2s',
              cursor: 'default',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#2db87a55'; e.currentTarget.style.transform = 'translateY(-4px)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = '#1e2d22'; e.currentTarget.style.transform = 'none'; }}
            >
              <div style={{
                width: '52px', height: '52px', background: '#2db87a',
                borderRadius: '12px', display: 'flex', alignItems: 'center',
                justifyContent: 'center', fontSize: '1.4rem', marginBottom: '1.5rem',
              }}>
                {f.icon}
              </div>
              <h3 style={{ fontWeight: 700, fontSize: '1.1rem', margin: '0 0 0.75rem' }}>{f.title}</h3>
              <p style={{ color: '#9ca3af', fontSize: '0.9rem', lineHeight: 1.65, margin: 0 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section id="about" style={{ padding: '6rem 4rem', textAlign: 'center' }}>
        <h2 style={{ fontSize: '2.4rem', fontWeight: 800, margin: '0 0 1.25rem' }}>
          Designed for Patients &amp; Doctors
        </h2>
        <p style={{ color: '#9ca3af', maxWidth: '600px', margin: '0 auto 2.5rem', lineHeight: 1.75 }}>
          SmartCare provides role-based access so patients can manage their health journey while
          doctors can efficiently handle diagnoses, prescriptions, and patient records — all from
          one unified dashboard.
        </p>
        <button onClick={() => navigate('/register')} style={{
          background: '#2db87a', border: 'none', color: '#fff',
          padding: '1rem 2.5rem', borderRadius: '10px',
          fontWeight: 700, fontSize: '1rem', cursor: 'pointer',
        }}>
          Get Started Today
        </button>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{
        borderTop: '1px solid #1e2d22', padding: '1.5rem 4rem',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        color: '#4a6355', fontSize: '0.82rem', flexWrap: 'wrap', gap: '0.5rem',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <span style={{ color: '#2db87a' }}>♥</span> SmartCare HMS
        </div>
        <span>© 2026 All rights reserved.</span>
      </footer>

    </div>
  );
};

export default Home;