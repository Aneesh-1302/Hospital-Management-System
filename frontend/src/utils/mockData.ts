import type {
  Patient, Doctor, Department,
  Appointment, MedicalRecord, Bill
} from '../types';

export const mockPatient: Patient = {
  patient_id: 1,
  name: 'Priyanshu Roy',
  age: 22,
  gender: 'Male',
  contact: '9876543210',
  address: '123, MG Road, Bangalore',
  blood_group: 'O+',
  secondary_contact: '9123456780',
  medical_history: 'Mild asthma, seasonal allergies',
};

export const mockDoctors: Doctor[] = [
  {
    doctor_id: 1,
    name: 'Dr. Anjali Sharma',
    specialization: 'Cardiologist',
    department_id: 1,
    department_name: 'Cardiology',
    contact: '9001122334',
    availability: 'Mon-Fri',
  },
  {
    doctor_id: 2,
    name: 'Dr. Ramesh Nair',
    specialization: 'Neurologist',
    department_id: 2,
    department_name: 'Neurology',
    contact: '9002233445',
    availability: 'Mon-Wed-Fri',
  },
  {
    doctor_id: 3,
    name: 'Dr. Sneha Patel',
    specialization: 'Dermatologist',
    department_id: 3,
    department_name: 'Dermatology',
    contact: '9003344556',
    availability: 'Tue-Thu',
  },
];

export const mockDepartments: Department[] = [
  { department_id: 1, department_name: 'Cardiology', description: 'Heart & cardiovascular care' },
  { department_id: 2, department_name: 'Neurology', description: 'Brain & nervous system' },
  { department_id: 3, department_name: 'Dermatology', description: 'Skin & hair care' },
  { department_id: 4, department_name: 'Orthopedics', description: 'Bones & joints' },
  { department_id: 5, department_name: 'Pediatrics', description: 'Child healthcare' },
];

export const mockAppointments: Appointment[] = [
  {
    appointment_id: 1,
    patient_id: 1,
    doctor_id: 1,
    appointment_date: '2026-03-10',
    appointment_time: '10:00:00',
    status: 'Confirmed',
    patient_name: 'Priyanshu Roy',
    doctor_name: 'Dr. Anjali Sharma',
  },
  {
    appointment_id: 2,
    patient_id: 1,
    doctor_id: 2,
    appointment_date: '2026-03-15',
    appointment_time: '11:30:00',
    status: 'Pending',
    patient_name: 'Priyanshu Roy',
    doctor_name: 'Dr. Ramesh Nair',
  },
  {
    appointment_id: 3,
    patient_id: 1,
    doctor_id: 3,
    appointment_date: '2026-02-20',
    appointment_time: '09:00:00',
    status: 'Cancelled',
    patient_name: 'Priyanshu Roy',
    doctor_name: 'Dr. Sneha Patel',
  },
];

export const mockMedicalRecords: MedicalRecord[] = [
  {
    record_id: 1,
    patient_id: 1,
    diagnosis: 'Hypertension - Stage 1',
    prescription: 'Amlodipine 5mg once daily',
    test_reports: 'ECG Normal, BP 140/90',
    created_at: '2026-02-20',
    doctor_name: 'Dr. Anjali Sharma',
  },
  {
    record_id: 2,
    patient_id: 1,
    diagnosis: 'Migraine',
    prescription: 'Sumatriptan 50mg as needed',
    test_reports: 'MRI Brain - No abnormality',
    created_at: '2026-01-15',
    doctor_name: 'Dr. Ramesh Nair',
  },
];

export const mockBills: Bill[] = [
  {
    bill_id: 1,
    patient_id: 1,
    consultation_charges: 500,
    lab_charges: 1200,
    medicine_charges: 350,
    total_amount: 2050,
    payment_status: 'Paid',
    created_at: '2026-02-20',
  },
  {
    bill_id: 2,
    patient_id: 1,
    consultation_charges: 500,
    lab_charges: 0,
    medicine_charges: 200,
    total_amount: 700,
    payment_status: 'Unpaid',
    created_at: '2026-01-15',
  },
];