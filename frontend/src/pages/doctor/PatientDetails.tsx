import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { patientAPI, medicalRecordAPI, appointmentAPI } from '../../services/api';
import type { Patient, MedicalRecord, Appointment } from '../../types';

const PatientDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [patient, setPatient] = useState<Patient | null>(null);
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const patientId = Number(id);

    setLoading(true);
    Promise.all([
      patientAPI.getById(patientId),
      medicalRecordAPI.getByPatient(patientId),
      appointmentAPI.getAll() // We'll filter all appointments for this patient
    ])
      .then(([patientRes, recordsRes, appointmentsRes]) => {
        if (patientRes.data.data) {
          setPatient(patientRes.data.data);
        }
        setRecords(recordsRes.data.data ?? []);
        // Filter appointments for this specific patient
        const patientApps = (appointmentsRes.data.data ?? []).filter(
          a => a.patient_id === patientId
        );
        setAppointments(patientApps);
      })
      .catch(err => console.error('Error fetching patient details:', err))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <div style={{ padding: '2rem', color: '#4a5568' }}>Loading patient details...</div>;
  }

  if (!patient) {
    return (
      <div style={{ padding: '2rem' }}>
        <p>Patient not found.</p>
        <button onClick={() => navigate(-1)}>Go Back</button>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '800px' }}>
      <button
        onClick={() => navigate(-1)}
        style={{ background: 'none', border: 'none', color: '#1a4a7a', cursor: 'pointer', fontSize: '0.875rem', marginBottom: '1rem', padding: 0 }}
      >
        ← Back
      </button>

      {/* Patient header */}
      <div style={{
        background: 'linear-gradient(135deg, #0a2540, #1a4a7a)',
        borderRadius: '12px', padding: '1.5rem', color: '#fff', marginBottom: '1.5rem',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            width: '56px', height: '56px', background: 'rgba(255,255,255,0.15)',
            borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem',
          }}>👤</div>
          <div>
            <h2 style={{ margin: 0, fontSize: '1.25rem' }}>{patient.name}</h2>
            <p style={{ margin: '0.25rem 0 0', color: '#94b8d8', fontSize: '0.85rem' }}>
              {patient.age} yrs · {patient.gender} · 🩸 {patient.blood_group}
            </p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '2rem' }}>
          <div><p style={{ margin: 0, fontSize: '0.75rem', color: '#94b8d8' }}>Contact</p><p style={{ margin: 0 }}>{patient.contact}</p></div>
          <div><p style={{ margin: 0, fontSize: '0.75rem', color: '#94b8d8' }}>Address</p><p style={{ margin: 0, fontSize: '0.85rem' }}>{patient.address}</p></div>
        </div>
      </div>

      {/* Medical history */}
      {patient.medical_history && (
        <div style={{ background: '#fffbeb', border: '1px solid #f6e05e', borderRadius: '10px', padding: '1rem', marginBottom: '1.5rem', fontSize: '0.875rem', color: '#744210' }}>
          📝 <strong>Medical History:</strong> {patient.medical_history}
        </div>
      )}

      {/* Records */}
      <h2 style={{ fontSize: '1rem', fontWeight: 600, color: '#4a5568', marginBottom: '1rem' }}>Medical Records</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
        {records.length === 0 ? (
          <p style={{ fontSize: '0.875rem', color: '#a0aec0' }}>No medical records available.</p>
        ) : (
          records.map(r => (
            <div key={r.record_id} style={{
              background: '#fff', border: '1px solid #e2e8f0', borderLeft: '4px solid #1a4a7a',
              borderRadius: '10px', padding: '1rem 1.25rem',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontWeight: 600, color: '#1a202c' }}>{r.diagnosis}</span>
                <span style={{ fontSize: '0.75rem', color: '#a0aec0' }}>
                  {r.created_at ? new Date(r.created_at).toLocaleDateString() : 'N/A'}
                </span>
              </div>
              <p style={{ margin: '0.5rem 0 0', fontSize: '0.85rem', color: '#4a5568' }}>💊 {r.prescription}</p>
            </div>
          ))
        )}
      </div>

      {/* Appointments */}
      <h2 style={{ fontSize: '1rem', fontWeight: 600, color: '#4a5568', marginBottom: '1rem' }}>Past & Upcoming Appointments</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem' }}>
        {appointments.length === 0 ? (
          <p style={{ fontSize: '0.875rem', color: '#a0aec0' }}>No appointments found.</p>
        ) : (
          appointments.map(a => (
            <div key={a.appointment_id} style={{
              background: '#fff', border: '1px solid #e2e8f0',
              borderRadius: '10px', padding: '0.75rem 1rem',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center'
            }}>
              <div>
                <p style={{ margin: 0, fontWeight: 500, fontSize: '0.875rem' }}>{a.doctor_name || 'Doctor'}</p>
                <p style={{ margin: 0, fontSize: '0.75rem', color: '#718096' }}>{a.appointment_date} @ {a.appointment_time}</p>
              </div>
              <span style={{
                fontSize: '0.7rem', fontWeight: 600, padding: '0.2rem 0.5rem', borderRadius: '4px',
                background: a.status === 'Confirmed' ? '#c6f6d5' : a.status === 'Pending' ? '#feebc8' : '#fed7d7',
                color: a.status === 'Confirmed' ? '#22543d' : a.status === 'Pending' ? '#744210' : '#822727'
              }}>
                {a.status}
              </span>
            </div>
          ))
        )}
      </div>

      {/* Quick actions */}
      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
        <button
          onClick={() => navigate('/doctor/prescribe', { state: { patientId: patient.patient_id } })}
          style={{ background: '#1a4a7a', color: '#fff', border: 'none', padding: '0.7rem 1.5rem', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}
        >
          + Write Prescription
        </button>
        <button
          onClick={() => navigate('/doctor/reports', { state: { patientId: patient.patient_id } })}
          style={{ background: '#f7fafc', color: '#4a5568', border: '1px solid #e2e8f0', padding: '0.7rem 1.5rem', borderRadius: '8px', cursor: 'pointer', fontWeight: 500 }}
        >
          Upload Report
        </button>
      </div>
    </div>
  );
};

export default PatientDetails;
