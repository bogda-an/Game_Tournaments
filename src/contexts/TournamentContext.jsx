import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  collection,
  addDoc,
  onSnapshot,
  updateDoc,
  deleteDoc,
  doc,
  Timestamp,
} from "firebase/firestore";
import { db } from "../firebase";               

const toTimestamp = (val) => {
  if (val instanceof Date)         return Timestamp.fromDate(val);
  if (val?.seconds)                return val;          
  if (typeof val === "string")     return Timestamp.fromDate(new Date(val));
  return Timestamp.now();
};


const TournamentContext = createContext();
export const useTournament = () => useContext(TournamentContext);


export const TournamentProvider = ({ children }) => {
  const [tournaments, setTournaments] = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState(null);

  useEffect(() => {
    const colRef = collection(db, "tournaments");

    const unsubscribe = onSnapshot(
      colRef,
      (snap) => {
        const list = snap.docs.map((d) => {
          const raw = d.data().date;
          let date = null;
          if (raw instanceof Timestamp) date = raw.toDate();
          else if (raw instanceof Date) date = raw;
          else if (typeof raw === "string") date = new Date(raw);

          return { id: d.id, ...d.data(), date };   
        });
        setTournaments(list);
        setLoading(false);
      },
      (err) => {
        console.error("Tournament listener error:", err);
        setError(err);
        setLoading(false);
      }
    );

    return unsubscribe; 
  }, []);


  const prepare = (data, isUpdate = false) => {
    const out = {};
    if (!isUpdate || data.title            !== undefined) out.title           = data.title            || "Untitled";
    if (!isUpdate || data.location         !== undefined) out.location        = data.location         || "TBD";
    if (!isUpdate || data.available_spots  !== undefined) out.available_spots = Number(data.available_spots) || 100;
    if (!isUpdate || data.date             !== undefined) out.date            = toTimestamp(data.date);
    return out;
  };

  const createTournament = async (data) =>
    addDoc(collection(db, "tournaments"), prepare(data));

  const updateTournament = async (id, data) =>
    updateDoc(doc(db, "tournaments", id), prepare(data, true));

  const deleteTournament = async (id) =>
    deleteDoc(doc(db, "tournaments", id));

  return (
    <TournamentContext.Provider
      value={{
        tournaments,
        loading,
        error,
        createTournament,
        updateTournament,
        deleteTournament,
      }}
    >
      {children}
    </TournamentContext.Provider>
  );
};
export default TournamentProvider;