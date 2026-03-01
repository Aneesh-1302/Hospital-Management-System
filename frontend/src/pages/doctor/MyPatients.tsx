import PatientCard from '../../components/doctor/PatientCard';
import { mockPatient } from '../../utils/mockData';

// In real app: fetch all patients assigned to this doctor
const patients = [mockPatient];

const MyPatients = () => (
  <div style={{ padding: '2rem', maxWidth: '750px' }}>
    <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1a202c', marginBottom: '0.25rem' }}>
      My Patients
    </h1>
    <p style={{ color: '#718096', marginBottom: '1.5rem' }}>{patients.length} patient(s) under your care</p>

    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      {patients.map(p => <PatientCard key={p.patient_id} patient={p} />)}
    </div>
  </div>
);

export default MyPatients;