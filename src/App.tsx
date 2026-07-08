import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import DashboardPage from "./pages/DashboardPage";
import PatientsPage from "./pages/PatientsPage";
import PatientFormPage from "./pages/PatientFormPage";
import PaymentHistoryPage from "./pages/PaymentHistoryPage";
import MainLayout from "./layouts/mainLayout";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="patients" element={<PatientsPage />} />
          <Route path="patients/add" element={<PatientFormPage />} />
          <Route path="patients/:id/edit" element={<PatientFormPage />} />
          <Route path="payment-history" element={<PaymentHistoryPage />} />
          <Route path="payment-history/:id" element={<PaymentHistoryPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
