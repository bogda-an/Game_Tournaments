import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../contexts/AuthContext";
import { collection, query, where, onSnapshot, orderBy } from "firebase/firestore";
import { db } from "../firebase";

import "../styles/UserDashboard.css";         

import TopBar from "../components/layout/TopBar";
import SearchBar from "../components/tournaments/SearchBar";
import TournamentList from "../components/tournaments/TournamentList";
import HeroSection from "../components/layout/HeroSection";
import TournamentMap from "../components/tournaments/TournamentMap";
import RegistrationHistory from "../components/tournaments/RegistrationHistory";

const DashboardPage = () => {
  const { user } = useAuth();

  const [tournaments, setTournaments] = useState([]);
  const [filteredTournaments, setFilteredTournaments] = useState([]);
  const [registrations, setRegistrations] = useState([]);

  
  const [searchCriteria, setSearchCriteria] = useState({
    title: "",
    location: "",
    date: "",
  });

  const homeRef        = useRef(null);
  const tournamentsRef = useRef(null);
  const regsRef        = useRef(null);

  useEffect(() => {
    document.body.classList.add("dashboard");
    return () => document.body.classList.remove("dashboard");
  }, []);

  const handleSearch = (criteria) => {
    setSearchCriteria(criteria);                      
    const filtered = tournaments.filter((tournament) => {
      const titleHit = criteria.title
        ? tournament.title.toLowerCase().includes(criteria.title.toLowerCase())
        : true;

      const locationHit = criteria.location
        ? tournament.location.toLowerCase().includes(criteria.location.toLowerCase())
        : true;

      const parseInputDate = (str) => {
        if (!str) return null;
        const uk = str.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
        if (uk) return new Date(`${uk[3]}-${uk[2]}-${uk[1]}`);
        const iso = new Date(str);
        return isNaN(iso) ? null : iso;
      };

      let dateHit = true;
      if (criteria.date) {
        const inputDate = parseInputDate(criteria.date);
        const storedDate =
          tournament.date?.toDate?.() ??
          (tournament.date instanceof Date ? tournament.date : new Date(tournament.date));

        if (inputDate && !isNaN(storedDate)) {
          const inputUK  = inputDate.toLocaleDateString("en-GB");
          const storedUK = storedDate.toLocaleDateString("en-GB");
          dateHit = inputUK === storedUK;
        } else {
          dateHit = false;
        }
      }

      return titleHit && locationHit && dateHit;
    });

    setFilteredTournaments(filtered);
  };

  useEffect(() => {
    const q = query(collection(db, "tournaments"));
    const unsubscribe = onSnapshot(q, (snap) => {
      const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setTournaments(list);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    handleSearch(searchCriteria);
  }, [tournaments]);

  useEffect(() => {
    if (!user?.uid) return;
    const q = query(
      collection(db, "registrations"),
      where("userId", "==", user.uid),
      orderBy("registration_date", "desc")
    );
    const unsub = onSnapshot(q, (snap) => {
      const regs = snap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
        registration_date: d.data().registration_date?.toDate(),
      }));
      setRegistrations(regs);
    });
    return unsub;
  }, [user?.uid]);

  return (
    <div className="dashboard-container">
      <TopBar
        homeRef={homeRef}
        tournamentsRef={tournamentsRef}
        regsRef={regsRef}
      />

      <HeroSection ref={homeRef} />

      <div className="main-content">
        <div className="search-bar-container">
          <SearchBar onSearch={handleSearch} />
        </div>

        <div className="tournaments-section" ref={tournamentsRef}>
          <TournamentList
            tournaments={filteredTournaments}
            refreshData={() => setFilteredTournaments([...filteredTournaments])}
          />
        </div>

        <div className="map-section">
          <TournamentMap tournaments={filteredTournaments} />
        </div>

        <div className="registrations-section" ref={regsRef}>
          <RegistrationHistory
            registrations={registrations}
            refreshData={() => setRegistrations([...registrations])}
          />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
