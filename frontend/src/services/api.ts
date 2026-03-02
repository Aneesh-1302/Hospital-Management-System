import axios from 'axios';
import type {
    Doctor, Patient, Appointment, Bill, MedicalRecord, ApiResponse
} from '../types';

// ─── Axios Instance ──────────────────────────────────────────────────────────
const api = axios.create({
    baseURL: 'http://localhost:5000/api',
    headers: { 'Content-Type': 'application/json' },
});

// Automatically attach JWT token to every request
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('shms_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

// ─── AUTH ────────────────────────────────────────────────────────────────────
export interface LoginPayload {
    email: string;
    password: string;
}

export interface RegisterPayload {
    email: string;
    password: string;
    role: 'Patient' | 'Doctor';
    name?: string;
    age?: number;
    gender?: string;
    contact?: string;
    address?: string;
    blood_group?: string;
    specialization?: string;
}

export const authAPI = {
    login: (data: LoginPayload) =>
        api.post<{ token: string; message: string }>('/auth/login', data),

    register: (data: RegisterPayload) =>
        api.post<{ message: string; user_id: number }>('/auth/register', data),
};

// ─── PATIENTS ────────────────────────────────────────────────────────────────
export const patientAPI = {
    getMyProfile: () =>
        api.get<ApiResponse<Patient>>('/patients/me'),

    getAll: () =>
        api.get<ApiResponse<Patient[]>>('/patients'),

    getById: (id: number) =>
        api.get<ApiResponse<Patient>>(`/patients/${id}`),

    update: (id: number, data: Partial<Patient>) =>
        api.put<ApiResponse<null>>(`/patients/${id}`, data),
};

// ─── DOCTORS ─────────────────────────────────────────────────────────────────
export const doctorAPI = {
    getAll: () =>
        api.get<ApiResponse<Doctor[]>>('/doctors'),
};

// ─── APPOINTMENTS ─────────────────────────────────────────────────────────────
export const appointmentAPI = {
    // Patient: get their own appointments
    getMy: () =>
        api.get<ApiResponse<Appointment[]>>('/appointments/my'),

    // Doctor: get their own appointments
    getDoctor: () =>
        api.get<ApiResponse<Appointment[]>>('/appointments/doctor'),

    // Admin/Doctor: get all
    getAll: () =>
        api.get<ApiResponse<Appointment[]>>('/appointments'),

    book: (data: {
        patient_id: number;
        doctor_id: number;
        appointment_date: string;
        appointment_time: string;
    }) => api.post<ApiResponse<null>>('/appointments', data),

    updateStatus: (id: number, status: string) =>
        api.put<ApiResponse<null>>(`/appointments/${id}/status`, { status }),
};

// ─── BILLING ─────────────────────────────────────────────────────────────────
export const billingAPI = {
    getMy: () =>
        api.get<ApiResponse<Bill[]>>('/billing/my'),

    getAll: () =>
        api.get<ApiResponse<Bill[]>>('/billing'),

    updatePaymentStatus: (id: number, payment_status: string) =>
        api.put<ApiResponse<null>>(`/billing/${id}/status`, { payment_status }),
};

// ─── MEDICAL RECORDS ─────────────────────────────────────────────────────────
export const medicalRecordAPI = {
    getMy: () =>
        api.get<ApiResponse<MedicalRecord[]>>('/medical-records/my'),

    getByPatient: (patientId: number) =>
        api.get<ApiResponse<MedicalRecord[]>>(`/medical-records/patient/${patientId}`),

    create: (data: {
        patient_id: number;
        appointment_id?: number;
        diagnosis: string;
        prescription: string;
        test_reports?: string;
    }) => api.post<ApiResponse<null>>('/medical-records', data),
};

export default api;
