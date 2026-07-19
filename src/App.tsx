import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import DashboardPage from "./pages/DashboardPage";
import PatientsPage from "./pages/PatientsPage";
import PatientFormPage from "./pages/PatientFormPage";
import PaymentHistoryPage from "./pages/PaymentHistoryPage";
import InquiriesPage from "./pages/Inquiries";
import InquiryFormPage from "./pages/InquiryFormPage";
import MainLayout from "./layouts/mainLayout";

const basename = import.meta.env.BASE_URL.replace(/\/$/, "") || "/";

function App() {
  return (
    <BrowserRouter basename={basename}>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          
          <Route path="inquiries" element={<InquiriesPage />} />
          <Route path="inquiries/add" element={<InquiryFormPage />} />
          <Route path="inquiries/:id/edit" element={<InquiryFormPage />} />

          <Route path="patients" element={<PatientsPage />} />
          <Route path="patients/add" element={<PatientFormPage />} />
          <Route path="patients/:id/edit" element={<PatientFormPage />} />
          <Route path="payment-history" element={<PaymentHistoryPage />} />
          <Route path="payment-history/:id" element={<PaymentHistoryPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
