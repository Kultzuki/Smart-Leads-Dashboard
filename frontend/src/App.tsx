import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import LeadsPage from './pages/LeadsPage';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';

// Unauthorized Page
const UnauthorizedPage = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-4">
    <h1 className="text-5xl font-extrabold mb-4 text-red-500">403</h1>
    <p className="text-xl text-gray-400">You do not have permission to view this page.</p>
  </div>
);

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />

        {/* Protected Routes wrapped in the Layout component */}
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/leads" element={<LeadsPage />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
