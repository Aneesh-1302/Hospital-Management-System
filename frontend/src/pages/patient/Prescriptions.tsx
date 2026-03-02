import { useState, useEffect } from 'react';
import PrescriptionCard from '../../components/patient/PrescriptionCard';
import { medicalRecordAPI } from '../../services/api';
import type { MedicalRecord } from '../../types';

const Prescriptions = () => {
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    medicalRecordAPI.getMy()
      .then(res => setRecords(res.data.data ?? []))
      .catch(err => console.error('Fetch prescriptions error:', err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ padding: '2rem', maxWidth: '750px', color: '#fff' }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 700, margin: '0 0 0.25rem' }}>Prescriptions</h1>
      <p style={{ color: '#6b7f72', marginBottom: '1.5rem' }}>
        {loading ? '...' : `${records.length} prescriptions on record`}
      </p>
      {loading ? (
        <p style={{ color: '#6b7f72' }}>Loading...</p>
      ) : records.length === 0 ? (
        <p style={{ color: '#6b7f72', textAlign: 'center', padding: '3rem' }}>No prescriptions found.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {records.map(r => (
            <PrescriptionCard key={r.record_id} record={r} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Prescriptions;
