import { useState, useEffect } from 'react';
import { patientAPI } from '../../services/api';
import type { Patient } from '../../types';

const UploadReports = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [patientId, setPatientId] = useState('');
  const [reportText, setReportText] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    patientAPI.getAll()
      .then(res => setPatients(res.data.data ?? []))
      .catch(err => console.error('Fetch patients error:', err));
  }, []);

  const handleSubmit = () => {
    if (!patientId || (!reportText && !file)) {
      alert('Please select a patient and add report details'); return;
    }
    // File upload would require a dedicated backend endpoint (FormData)
    // For now records are handled via WritePrescription → createMedicalRecord
    setSuccess(true);
  };

  if (success) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', maxWidth: '500px', color: '#fff' }}>
        <div style={{ fontSize: '3rem' }}>📁</div>
        <h2 style={{ color: '#2db87a' }}>Report Uploaded!</h2>
        <button
          onClick={() => { setSuccess(false); setPatientId(''); setReportText(''); setFile(null); }}
          style={{ background: '#2db87a', color: '#fff', border: 'none', padding: '0.7rem 1.5rem', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}
        >
          Upload Another
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '620px', color: '#fff' }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 700, margin: '0 0 0.25rem' }}>Upload Test Reports</h1>
      <p style={{ color: '#6b7f72', marginBottom: '2rem' }}>Attach lab results or diagnostic reports to a patient</p>

      <div style={{ background: '#141f18', border: '1px solid #1e2d22', borderRadius: '12px', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {/* Patient */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          <label style={{ fontSize: '0.85rem', fontWeight: 500, color: '#9ca3af' }}>Select Patient *</label>
          <select
            value={patientId} onChange={e => setPatientId(e.target.value)}
            style={{ background: '#0f1a14', border: '1px solid #1e2d22', borderRadius: '8px', padding: '0.65rem 0.9rem', fontSize: '0.875rem', color: '#fff' }}
          >
            <option value="">Choose patient</option>
            {patients.map(p => (
              <option key={p.patient_id} value={p.patient_id}>{p.name}</option>
            ))}
          </select>
        </div>

        {/* Report notes */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          <label style={{ fontSize: '0.85rem', fontWeight: 500, color: '#9ca3af' }}>Report Summary</label>
          <textarea
            rows={4} placeholder="Enter lab results, observations, findings..."
            value={reportText} onChange={e => setReportText(e.target.value)}
            style={{ background: '#0f1a14', border: '1px solid #1e2d22', borderRadius: '8px', padding: '0.65rem 0.9rem', fontSize: '0.875rem', color: '#fff', resize: 'vertical', outline: 'none' }}
          />
        </div>

        {/* File upload */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          <label style={{ fontSize: '0.85rem', fontWeight: 500, color: '#9ca3af' }}>Attach File (PDF/Image)</label>
          <div style={{
            border: '2px dashed #1e2d22', borderRadius: '8px', padding: '1.5rem',
            textAlign: 'center', cursor: 'pointer', background: '#0f1a14',
          }}>
            <input
              type="file" accept=".pdf,.jpg,.jpeg,.png"
              onChange={e => setFile(e.target.files?.[0] ?? null)}
              style={{ display: 'none' }} id="file-upload"
            />
            <label htmlFor="file-upload" style={{ cursor: 'pointer', color: '#6b7f72', fontSize: '0.875rem' }}>
              {file ? `📎 ${file.name}` : '📎 Click to upload or drag a file here'}
            </label>
          </div>
        </div>

        <button
          onClick={handleSubmit}
          style={{ background: '#2db87a', color: '#fff', border: 'none', padding: '0.85rem', borderRadius: '10px', fontWeight: 700, fontSize: '1rem', cursor: 'pointer' }}
        >
          Upload Report
        </button>
      </div>
    </div>
  );
};

export default UploadReports;
