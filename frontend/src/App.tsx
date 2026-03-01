import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import Navbar from './components/common/Navbar';
import Sidebar from './components/common/Sidebar';
import Footer from './components/common/Footer';

// Pages
import Home               from './pages/Home';
import Login              from './pages/auth/Login';
import Register           from './pages/auth/Register';
import PatientDashboard   from './pages/patient/PatientDashboard';
import BookAppointment    from './pages/patient/BookAppointment';
import MyAppointments     from './pages/patient/MyAppointments';
import MedicalRecords     from './pages/patient/MedicalRecords';
import Prescriptions      from './pages/patient/Prescriptions';
import Billing            from './pages/patient/Billing';
import DoctorDashboard    from './pages/doctor/DoctorDashboard';
import DoctorAppointments from './pages/doctor/DoctorAppointments';
import MyPatients         from './pages/doctor/MyPatients';
import PatientDetails     from './pages/doctor/PatientDetails';
import WritePrescription  from './pages/doctor/WritePrescription';
import UploadReports      from './pages/doctor/UploadReports';
import NotFound           from './pages/NotFound';

// Layout with Navbar + Sidebar + Footer
const DashboardLayout = () => (
  <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
    <Navbar />
    <div style={{ display: 'flex', flex: 1 }}>
      <Sidebar />
      <main style={{ flex: 1, background: '#0f1a14', padding: '0' }}>
        <Outlet />
      </main>
    </div>
    <Footer />
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public routes */}
          <Route path="/"         element={<Home />} />
          <Route path="/login"    element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Patient routes */}
          <Route element={<ProtectedRoute role="patient"><DashboardLayout /></ProtectedRoute>}>
            <Route path="/patient/dashboard"    element={<PatientDashboard />} />
            <Route path="/patient/book"         element={<BookAppointment />} />
            <Route path="/patient/appointments" element={<MyAppointments />} />
            <Route path="/patient/records"      element={<MedicalRecords />} />
            <Route path="/patient/prescriptions"element={<Prescriptions />} />
            <Route path="/patient/billing"      element={<Billing />} />
          </Route>

          {/* Doctor routes */}
          <Route element={<ProtectedRoute role="doctor"><DashboardLayout /></ProtectedRoute>}>
            <Route path="/doctor/dashboard"    element={<DoctorDashboard />} />
            <Route path="/doctor/appointments" element={<DoctorAppointments />} />
            <Route path="/doctor/patients"     element={<MyPatients />} />
            <Route path="/doctor/patients/:id" element={<PatientDetails />} />
            <Route path="/doctor/prescribe"    element={<WritePrescription />} />
            <Route path="/doctor/reports"      element={<UploadReports />} />
          </Route>

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;