import { useState } from 'react';
import AppointmentItem from '../../components/doctor/AppointmentItem';
import { mockAppointments } from '../../utils/mockData';
import type { Appointment } from '../../types';

const DoctorAppointments = () => {
  const [appointments, setAppointments] = useState<Appointment[]>(mockAppointments);
  const [filter, setFilter] = useState<'All' | 'Confirmed' | 'Pending' | 'Cancelled'>('All');

  const handleConfirm = (id: number) =>
    setAppointments(prev => prev.map(a => a.appointment_id === id ? { ...a, status: 'Confirmed' } : a));

  const handleCancel = (id: number) =>
    setAppointments(prev => prev.map(a => a.appointment_id === id ? { ...a, status: 'Cancelled' } : a));

  const filtered = filter === 'All' ? appointments : appointments.filter(a => a.status === filter);

  return (
    <div style={{ padding: '2rem', maxWidth: '750px' }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1a202c', marginBottom: '0.25rem' }}>
        Appointments
      </h1>
      <p style={{ color: '#718096', marginBottom: '1.5rem' }}>Manage your patient appointments</p>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {(['All', 'Confirmed', 'Pending', 'Cancelled'] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{
            padding: '0.4rem 1rem', borderRadius: '99px', border: 'none', cursor: 'pointer',
            fontSize: '0.82rem', fontWeight: filter === f ? 600 : 400,
            background: filter === f ? '#1a4a7a' : '#f7fafc',
            color: filter === f ? '#fff' : '#718096',
          }}>
            {f}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {filtered.length === 0
          ? <p style={{ color: '#a0aec0', textAlign: 'center', padding: '3rem' }}>No appointments found.</p>
          : filtered.map(a => (
            <AppointmentItem
              key={a.appointment_id}
              appointment={a}
              onConfirm={handleConfirm}
              onCancel={handleCancel}
            />
          ))
        }
      </div>
    </div>
  );
};

export default DoctorAppointments;