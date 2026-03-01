import type { Appointment } from '../../types';

interface Props {
  appointment: Appointment;
  onConfirm?: (id: number) => void;
  onCancel?: (id: number) => void;
}

const AppointmentItem = ({ appointment, onConfirm, onCancel }: Props) => (
  <div style={{
    background: '#fff',
    border: '1px solid #e2e8f0',
    borderRadius: '12px',
    padding: '1rem 1.5rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  }}>
    <div>
      <p style={{ fontWeight: 600, color: '#1a202c', margin: 0 }}>
        {appointment.patient_name ?? `Patient #${appointment.patient_id}`}
      </p>
      <p style={{ color: '#718096', fontSize: '0.82rem', margin: '0.2rem 0 0' }}>
        📅 {appointment.appointment_date} &nbsp; ⏰ {appointment.appointment_time}
      </p>
    </div>

    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
      {appointment.status === 'Pending' && (
        <>
          {onConfirm && (
            <button
              onClick={() => onConfirm(appointment.appointment_id)}
              style={{
                background: '#1a4a7a', color: '#fff',
                border: 'none', padding: '0.35rem 0.85rem',
                borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem',
              }}
            >
              Confirm
            </button>
          )}
          {onCancel && (
            <button
              onClick={() => onCancel(appointment.appointment_id)}
              style={{
                background: 'transparent', color: '#e53e3e',
                border: '1px solid #fc8181', padding: '0.35rem 0.85rem',
                borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem',
              }}
            >
              Cancel
            </button>
          )}
        </>
      )}
      {appointment.status !== 'Pending' && (
        <span style={{
          background: appointment.status === 'Confirmed' ? '#f0fff4' : '#fff5f5',
          color: appointment.status === 'Confirmed' ? '#276749' : '#9b2c2c',
          padding: '0.25rem 0.75rem',
          borderRadius: '99px',
          fontSize: '0.75rem',
          fontWeight: 600,
        }}>
          {appointment.status}
        </span>
      )}
    </div>
  </div>
);

export default AppointmentItem;