import { useEffect, useState } from "react";
import { HashRouter, Navigate, Outlet, Route, Routes, useLocation } from "react-router-dom";
import DashboardPage from "./pages/DashboardPage";
import PatientsPage from "./pages/PatientsPage";
import PatientFormPage from "./pages/PatientFormPage";
import PaymentHistoryPage from "./pages/PaymentHistoryPage";
import InquiriesPage from "./pages/Inquiries";
import InquiryFormPage from "./pages/InquiryFormPage";
import ExpensesPage from "./pages/Expenses";
import Login from "./pages/Login";
import MainLayout from "./layouts/mainLayout";

function isTokenExpired(expires?: string | null) {
  if (!expires) {
    return true;
  }

  const expiryTime = new Date(expires).getTime();
  if (Number.isNaN(expiryTime)) {
    return true;
  }

  return Date.now() >= expiryTime;
}

function clearAuthStorage() {
  localStorage.removeItem("token");
  localStorage.removeItem("tokenExpires");
}

function ProtectedRoute({ isAuthenticated }: { isAuthenticated: boolean }) {
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}

function AuthWatcher({ onAuthChange }: { onAuthChange: (value: boolean) => void }) {
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const expires = localStorage.getItem("tokenExpires");

    if (!token || isTokenExpired(expires)) {
      clearAuthStorage();
      onAuthChange(false);
      return;
    }

    onAuthChange(true);
  }, [location.pathname, onAuthChange]);

  return null;
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const token = localStorage.getItem("token");
    const expires = localStorage.getItem("tokenExpires");

    if (!token || isTokenExpired(expires)) {
      clearAuthStorage();
      return false;
    }

    return true;
  });

  return (
    <HashRouter>
      <AuthWatcher onAuthChange={setIsAuthenticated} />
      <Routes>
        <Route
          path="/login"
          element={
            isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login onLogin={() => setIsAuthenticated(true)} />
          }
        />

        <Route element={<ProtectedRoute isAuthenticated={isAuthenticated} />}>
          <Route element={<MainLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="inquiries" element={<InquiriesPage />} />
            <Route path="inquiries/add" element={<InquiryFormPage />} />
            <Route path="inquiries/:id/edit" element={<InquiryFormPage />} />

            <Route path="patients" element={<PatientsPage />} />
            <Route path="patients/add" element={<PatientFormPage />} />
            <Route path="patients/:id/edit" element={<PatientFormPage />} />
            <Route path="payment-history" element={<PaymentHistoryPage />} />
            <Route path="payment-history/:id" element={<PaymentHistoryPage />} />
            <Route path="expenses" element={<ExpensesPage />} />
          </Route>
        </Route>

        <Route path="/" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />} />
        <Route path="*" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
