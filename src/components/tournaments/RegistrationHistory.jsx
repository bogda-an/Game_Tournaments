import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import "../../styles/RegistrationHistory.css";
import { db } from "../../firebase";
import {
  doc,
  deleteDoc,
  runTransaction,
  arrayRemove,
} from "firebase/firestore";

const RegistrationHistory = ({ registrations, refreshData }) => {
  const [message, setMessage] = useState("");
  const { user } = useAuth();

  const formatDate = (date) => {
    try {
      if (!date) return "N/A";
      const d = date?.toDate ? date.toDate() : new Date(date);
      return d.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "N/A";
    }
  };

  const handleCancel = async (registrationId) => {
    try {
      await runTransaction(db, async (tx) => {
        const regRef = doc(db, "registrations", registrationId);
        const regSnap = await tx.get(regRef);
        if (!regSnap.exists()) throw new Error("Registration not found");
        if (regSnap.data().userId !== user.uid)
          throw new Error("Unauthorized");

        const tourRef = doc(db, "tournaments", regSnap.data().tournamentId);
        const tourSnap = await tx.get(tourRef);
        if (!tourSnap.exists()) throw new Error("Associated tournament missing");

        tx.update(tourRef, {
          available_spots: (tourSnap.data().available_spots || 0) + 1,
          participants: arrayRemove(user.uid),
        });
        tx.delete(regRef);
      });

      setMessage(" Registration cancelled");
      setTimeout(() => setMessage(""), 3000);
      refreshData();
    } catch (err) {
      setMessage(` ${err.message}`);
      setTimeout(() => setMessage(""), 4000);
    }
  };

  return (
    <section className="registration-history">
      <div className="registration-inner">
        <h2>Your Tournament Registrations</h2>
        {message && <p className="message-banner">{message}</p>}

        {registrations.length === 0 ? (
          <p className="no-registrations">No active registrations found</p>
        ) : (
          <div className="registration-list">
            {registrations.map((reg) => (
              <div key={reg.id} className="registration-item">
                <div className="registration-info">
                  <h3>{reg.title || "Unnamed Tournament"}</h3>
                  <p>
                    <span className="label">Event Date: </span>
                    {formatDate(reg.date)}
                  </p>
                  <p>
                    <span className="label">Location: </span>
                    {reg.location || "TBD"}
                  </p>
                  <p>
                    <span className="label">Registered On: </span>
                    {formatDate(reg.registration_date)}
                  </p>
                </div>

                <button
                  className="cancel-button"
                  onClick={() => handleCancel(reg.id)}
                >
                  Cancel Registration
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default RegistrationHistory;
