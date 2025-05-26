import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import "../../styles/TournamentCard.css";

import { db } from "../../firebase";
import {
  doc,
  runTransaction,
  arrayUnion,
  collection,
  addDoc,
} from "firebase/firestore";

const formatDate = (raw) => {
  if (!raw) return "N/A";
  const d =
    raw instanceof Date ? raw
    : raw.toDate         ? raw.toDate()
    :                      new Date(raw);
    return isNaN(d) ? "N/A" : d.toLocaleDateString("en-GB");
};

const TournamentCard = ({ tournament, refreshData }) => {
  const { user } = useAuth();
  const [msg, setMsg] = useState("");

  const handleRegister = async () => {
    if (!user) {
      setMsg("Please log in first.");
      return;
    }

    try {

      await runTransaction(db, async (tx) => {
        const tRef  = doc(db, "tournaments", tournament.id);
        const snap  = await tx.get(tRef);
        if (!snap.exists()) throw new Error("Tournament deleted.");

        const data = snap.data();
        if ((data.available_spots ?? 0) <= 0)
          throw new Error("No spots left.");
        if (data.participants?.includes(user.uid))
          throw new Error("Already registered.");

        tx.update(tRef, {
          available_spots: (data.available_spots || 0) - 1,
          participants: arrayUnion(user.uid),
        });
      });

      await addDoc(collection(db, "registrations"), {
        userId:         user.uid,
        tournamentId:   tournament.id,
        title:          tournament.title,
        date:           tournament.date,
        location:       tournament.location,
        registration_date: new Date(),
      });

      setMsg("✔ Registered!");
      refreshData?.();                         
    } catch (err) {
      console.error(err);
      setMsg(err.message || "Registration failed.");
    }
  };

  return (
    <div className="tournament-card">
      <h3>{tournament.title}</h3>
      <p>Date: {formatDate(tournament.date)}</p>
      <p>Location: {tournament.location}</p>
      <p>Spots Left: {tournament.available_spots}</p>
      {msg && <p className="message">{msg}</p>}

      <button
        className="register-button"
        onClick={handleRegister}
        disabled={
          tournament.available_spots <= 0 ||
          tournament.participants?.includes(user?.uid)
        }
      >
        {tournament.participants?.includes(user?.uid)
          ? "Registered"
          : tournament.available_spots > 0
          ? "Register"
          : "Full"}
      </button>
    </div>
  );
};

export default TournamentCard;
