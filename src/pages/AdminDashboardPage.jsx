import React, { useState, useEffect } from "react";
import { useTournament } from "../contexts/TournamentContext";
import { useAuth } from "../contexts/AuthContext";
import { Navigate, useNavigate } from "react-router-dom";

import AdminTournamentForm from "../components/admin/AdminTournamentForm";
import AdminTournamentList from "../components/admin/AdminTournamentList";

import "../styles/AdminDashboard.css";

const AdminDashboardPage = () => {
  const {
    tournaments,
    loading,
    createTournament,
    updateTournament,
    deleteTournament,
  } = useTournament();

  const { isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    document.body.classList.add("admin");
    return () => document.body.classList.remove("admin");
  }, []);

  if (!isAdmin()) {
    return <Navigate to="/dashboard" replace />;
  }


  const handleCreate = (data) => createTournament(data);

  const handleUpdate = (data) => {
    if (!editing) return Promise.resolve();
    return updateTournament(editing.id, data).then(() => setEditing(null));
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (err) {

      alert("Error during logout. Please try again.");
    }
  };


  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h1>Tournament Management Dashboard</h1>
        <button className="logout-button" onClick={handleLogout}>
          Log out
        </button>
      </div>

      <div className="admin-content">
        <div className="admin-form-section">
          <div className="create-form-card">
            <h3>Create New Tournament</h3>
            <AdminTournamentForm onSubmit={handleCreate} />
          </div>

          {editing && (
            <div className="edit-form-card">
              <h3>Edit Tournament</h3>
              <AdminTournamentForm
                tournament={editing}
                onSubmit={handleUpdate}
                onCancel={() => setEditing(null)}
              />
            </div>
          )}
        </div>

        <div className="admin-list-section">
          <AdminTournamentList
            tournaments={tournaments}
            loading={loading}
            onEdit={setEditing}
            onDelete={deleteTournament}
          />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
