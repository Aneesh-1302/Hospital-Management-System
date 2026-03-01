import { useState } from 'react';
import { mockPatient } from '../../utils/mockData';

const UploadReports = () => {
  const [patientId, setPatientId] = useState('');
  const [reportText, setReportText] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = () => {
    if (!patientId || (!reportText && !file)) {
      alert('Please select a patient and add report details'); return;
    }
    // TODO: Replace with real API call (use FormData for file uploads)
    // const formData = new FormData();
    // formData.append('patient_id', patientId);
    // formData.append('report', reportText);
    // if (file) formData.append('file', file);
    // await axios.post('/api/reports', formData);
    setSuccess(true);
  };

  if (success) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', maxWidth: '500px' }}>
        <div style={{ fontSize: '3rem' }}>📁</div>
        <h2 style={{ color: '#276749' }}>Report Uploaded!</h2>
        <button
          onClick={() => { setSuccess(false); setPatientId(''); setReportText(''); setFile(null); }}
          style={{ background: '#1a4a7a', color: '#fff', border: 'none', padding: '0.7rem 1.5rem', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}
        >
          Upload Another
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '620px' }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1a202c', marginBottom: '0.25rem' }}>
        Upload Test Reports
      </h1>
      <p style={{ color: '#718096', marginBottom: '2rem' }}>Attach lab results or diagnostic reports to a patient</p>

      <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {/* Patient */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          <label style={{ fontSize: '0.85rem', fontWeight: 500, color: '#4a5568' }}>Select Patient *</label>
          <select
            value={patientId} onChange={e => setPatientId(e.target.value)}
            style={{ border: '1px solid #e2e8f0', borderRadius: '8px', padding: '0.65rem 0.9rem', fontSize: '0.875rem' }}
          >
            <option value="">Choose patient</option>
            <option value={mockPatient.patient_id}>{mockPatient.name}</option>
          </select>
        </div>

        {/* Report notes */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          <label style={{ fontSize: '0.85rem', fontWeight: 500, color: '#4a5568' }}>Report Summary</label>
          <textarea
            rows={4} placeholder="Enter lab results, observations, findings..."
            value={reportText} onChange={e => setReportText(e.target.value)}
            style={{ border: '1px solid #e2e8f0', borderRadius: '8px', padding: '0.65rem 0.9rem', fontSize: '0.875rem', resize: 'vertical', outline: 'none' }}
          />
        </div>

        {/* File upload */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          <label style={{ fontSize: '0.85rem', fontWeight: 500, color: '#4a5568' }}>Attach File (PDF/Image)</label>
          <div style={{
            border: '2px dashed #e2e8f0', borderRadius: '8px', padding: '1.5rem',
            textAlign: 'center', cursor: 'pointer', background: '#f7fafc',
          }}>
            <input
              type="file" accept=".pdf,.jpg,.jpeg,.png"
              onChange={e => setFile(e.target.files?.[0] ?? null)}
              style={{ display: 'none' }} id="file-upload"
            />
            <label htmlFor="file-upload" style={{ cursor: 'pointer', color: '#718096', fontSize: '0.875rem' }}>
              {file ? `📎 ${file.name}` : '📎 Click to upload or drag a file here'}
            </label>
          </div>
        </div>

        <button
          onClick={handleSubmit}
          style={{ background: '#1a4a7a', color: '#fff', border: 'none', padding: '0.85rem', borderRadius: '10px', fontWeight: 700, fontSize: '1rem', cursor: 'pointer' }}
        >
          Upload Report
        </button>
      </div>
    </div>
  );
};

export default UploadReports;