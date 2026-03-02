import { useState, useEffect } from 'react';
import PatientCard from '../../components/doctor/PatientCard';
import { patientAPI } from '../../services/api';
import type { Patient } from '../../types';

const MyPatients = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    patientAPI.getAll()
      .then(res => setPatients(res.data.data ?? []))
      .catch(err => console.error('Fetch patients error:', err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ padding: '2rem', maxWidth: '750px', color: '#fff' }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 700, margin: '0 0 0.25rem' }}>My Patients</h1>
      <p style={{ color: '#6b7f72', marginBottom: '1.5rem' }}>
        {loading ? '...' : `${patients.length} patient(s) registered`}
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {loading ? (
          <p style={{ color: '#6b7f72' }}>Loading patients...</p>
        ) : patients.length === 0 ? (
          <p style={{ color: '#6b7f72', textAlign: 'center', padding: '3rem' }}>No patients found.</p>
        ) : (
          patients.map(p => <PatientCard key={p.patient_id} patient={p} />)
        )}
      </div>
    </div>
  );
};

export default MyPatients;
