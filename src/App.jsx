import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";

import ProtectedRoute from "./components/auth/ProtectedRoute";
import AuthProvider from "./contexts/AuthContext";
import { TournamentProvider } from "./contexts/TournamentContext";

import { ToastContainer } from "react-toastify";          
import "react-toastify/dist/ReactToastify.css";           

function App() {
  return (
    <>
      <AuthProvider>
        <TournamentProvider>
          <Router>
            <Routes>
              <Route path="/" element={<LoginPage />} />

              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <DashboardPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute adminOnly>
                    <AdminDashboardPage />
                  </ProtectedRoute>
                }
              />

              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </Router>
        </TournamentProvider>
      </AuthProvider>

      <ToastContainer position="top-right" autoClose={3000} />   {/* ⬅️  NEW */}
    </>
  );
}

export default App;
