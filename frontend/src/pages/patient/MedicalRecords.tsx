import { useState, useEffect } from 'react';
import { medicalRecordAPI, patientAPI } from '../../services/api';
import type { MedicalRecord, Patient } from '../../types';

const MedicalRecords = () => {
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [profile, setProfile] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      medicalRecordAPI.getMy(),
      patientAPI.getMyProfile(),
    ])
      .then(([recRes, profRes]) => {
        setRecords(recRes.data.data ?? []);
        setProfile(profRes.data.data ?? null);
      })
      .catch(err => console.error('Medical records load error:', err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ padding: '2rem', color: '#fff' }}>Loading...</div>;

  return (
    <div style={{ padding: '2rem', maxWidth: '750px', color: '#fff' }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 700, margin: '0 0 0.25rem' }}>Medical Records</h1>
      <p style={{ color: '#6b7f72', marginBottom: '1.5rem' }}>Your complete health history</p>

      {/* Patient summary card */}
      {profile && (
        <div style={{
          background: 'linear-gradient(135deg, #0a2540, #1a4a7a)',
          borderRadius: '12px', padding: '1.5rem', color: '#fff', marginBottom: '2rem',
          display: 'flex', gap: '2rem', flexWrap: 'wrap',
        }}>
          {[
            { label: 'Name', value: profile.name },
            { label: 'Blood Group', value: profile.blood_group || '—' },
            { label: 'Age', value: profile.age ? `${profile.age} yrs` : '—' },
            { label: 'Gender', value: profile.gender || '—' },
          ].map(item => (
            <div key={item.label}>
              <p style={{ margin: 0, fontSize: '0.75rem', color: '#94b8d8' }}>{item.label}</p>
              <p style={{ margin: '0.2rem 0 0', fontWeight: 600 }}>{item.value}</p>
            </div>
          ))}
        </div>
      )}

      {/* Medical history note */}
      {profile?.medical_history && (
        <div style={{
          background: '#2a2010', border: '1px solid #4a3a10',
          borderRadius: '10px', padding: '1rem 1.25rem', marginBottom: '1.5rem',
          fontSize: '0.875rem', color: '#f6c90e',
        }}>
          📝 <strong>Medical History:</strong> {profile.medical_history}
        </div>
      )}

      {/* Records */}
      {records.length === 0 ? (
        <p style={{ color: '#6b7f72', textAlign: 'center', padding: '3rem' }}>No medical records found.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {records.map(r => (
            <div key={r.record_id} style={{
              background: '#141f18', border: '1px solid #1e2d22',
              borderLeft: '4px solid #2db87a', borderRadius: '12px', padding: '1.25rem 1.5rem',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <span style={{ fontWeight: 600, color: '#fff' }}>{r.diagnosis}</span>
                <span style={{ fontSize: '0.78rem', color: '#6b7f72' }}>{r.created_at?.split('T')[0] ?? ''}</span>
              </div>
              <p style={{ fontSize: '0.82rem', color: '#6b7f72', margin: '0 0 0.75rem' }}>👨‍⚕️ {r.doctor_name || 'Unknown doctor'}</p>
              <div style={{ background: '#0f1a14', borderRadius: '8px', padding: '0.75rem', fontSize: '0.875rem', color: '#9ca3af', marginBottom: '0.5rem' }}>
                <strong>💊 Prescription:</strong> {r.prescription}
              </div>
              {r.test_reports && (
                <div style={{ background: '#1a2e22', borderRadius: '8px', padding: '0.75rem', fontSize: '0.875rem', color: '#2db87a' }}>
                  <strong>🧪 Reports:</strong> {r.test_reports}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MedicalRecords;
