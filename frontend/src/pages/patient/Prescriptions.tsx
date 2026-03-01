import PrescriptionCard from '../../components/patient/PrescriptionCard';
import { mockMedicalRecords } from '../../utils/mockData';

const Prescriptions = () => (
  <div style={{ padding: '2rem', maxWidth: '750px' }}>
    <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1a202c', marginBottom: '0.25rem' }}>
      Prescriptions
    </h1>
    <p style={{ color: '#718096', marginBottom: '1.5rem' }}>
      {mockMedicalRecords.length} prescriptions on record
    </p>
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {mockMedicalRecords.map(r => (
        <PrescriptionCard key={r.record_id} record={r} />
      ))}
    </div>
  </div>
);

export default Prescriptions;