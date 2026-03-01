import type { Appointment } from '../../types';

interface Props {
  appointment: Appointment;
  onCancel?: (id: number) => void;
}

const statusColors: Record<string, { bg: string; color: string }> = {
  Confirmed: { bg: '#f0fff4', color: '#276749' },
  Pending:   { bg: '#fffbeb', color: '#92400e' },
  Cancelled: { bg: '#fff5f5', color: '#9b2c2c' },
};

const AppointmentCard = ({ appointment, onCancel }: Props) => {
  const status = statusColors[appointment.status] ?? statusColors.Pending;

  return (
    <div style={{
      background: '#fff',
      border: '1px solid #e2e8f0',
      borderRadius: '12px',
      padding: '1.25rem 1.5rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
      transition: 'box-shadow 0.2s',
    }}
    onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.1)')}
    onMouseLeave={e => (e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.05)')}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
        <p style={{ fontWeight: 600, color: '#1a202c', margin: 0 }}>
          {appointment.doctor_name ?? `Doctor #${appointment.doctor_id}`}
        </p>
        <p style={{ color: '#718096', fontSize: '0.85rem', margin: 0 }}>
          📅 {appointment.appointment_date} &nbsp;⏰ {appointment.appointment_time}
        </p>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <span style={{
          background: status.bg,
          color: status.color,
          padding: '0.25rem 0.75rem',
          borderRadius: '99px',
          fontSize: '0.75rem',
          fontWeight: 600,
        }}>
          {appointment.status}
        </span>

        {appointment.status !== 'Cancelled' && onCancel && (
          <button
            onClick={() => onCancel(appointment.appointment_id)}
            style={{
              background: 'transparent',
              border: '1px solid #fc8181',
              color: '#e53e3e',
              padding: '0.3rem 0.75rem',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '0.8rem',
            }}
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  );
};

export default AppointmentCard;