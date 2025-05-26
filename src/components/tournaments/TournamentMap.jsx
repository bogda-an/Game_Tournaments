import React, { useEffect, useRef, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import customIcon from "../../assets/marker-icon-blue.png";
import customIcon2x from "../../assets/marker-icon-2x-blue.png";
import customShadow from "../../assets/marker-shadow.png";
import "../../styles/Map.css";

import { useAuth } from "../../contexts/AuthContext";
import { db } from "../../firebase";
import {
  doc,
  runTransaction,
  arrayUnion,
  collection,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";

const CustomMarkerIcon = L.icon({
  iconUrl: customIcon,
  iconRetinaUrl: customIcon2x,
  shadowUrl: customShadow,
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40],
  shadowSize: [50, 50],
});


const CITY_COORDS = {
  london: [51.5074, -0.1278],
  "london, uk": [51.5074, -0.1278],
  paris: [48.8566, 2.3522],
  berlin: [52.52, 13.405],
  madrid: [40.4168, -3.7038],
  rome: [41.9028, 12.4964],
};


const formatDate = (raw) => {
  if (!raw) return "N/A";
  const d = raw.toDate ? raw.toDate() : raw instanceof Date ? raw : new Date(raw);
  return isNaN(d) ? "N/A" : d.toLocaleDateString("en-GB");
};

const getLatLng = ({ latitude, longitude, location }) => {
  if (typeof latitude === "number" && typeof longitude === "number") {
    return [latitude, longitude];
  }
  if (location) {
    const coord = CITY_COORDS[String(location).toLowerCase().trim()];
    if (coord) return coord;
  }
  return null; 
};


const TournamentMap = ({ tournaments, refreshData }) => {
  const { user } = useAuth();
  const mapRef = useRef();

 
  const points = useMemo(
    () =>
      tournaments
        .map((t) => ({ ...t, coord: getLatLng(t) }))
        .filter((t) => t.coord),
    [tournaments]
  );

  useEffect(() => {
    if (mapRef.current && points.length > 0) {
      const bounds = L.latLngBounds(points.map((p) => p.coord));
      mapRef.current.flyToBounds(bounds, { padding: [50, 50] });
    }
  }, [points]);


  useEffect(() => {
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: customIcon2x,
      iconUrl: customIcon,
      shadowUrl: customShadow,
    });
  }, []);


  const initialCenter = points[0]?.coord || [20, 0];

  const registerForTournament = async (tournament) => {
    if (!user?.uid) {
      alert("Please log in to register.");
      return;
    }

    try {
      await runTransaction(db, async (tx) => {
        const tRef = doc(db, "tournaments", tournament.id);
        const snap = await tx.get(tRef);
        if (!snap.exists()) throw new Error("Tournament removed.");

        const data = snap.data();
        if (data.participants?.includes(user.uid))
          throw new Error("Already registered.");
        if ((data.available_spots ?? 0) <= 0)
          throw new Error("No spots left.");

        tx.update(tRef, {
          available_spots: (data.available_spots || 0) - 1,
          participants: arrayUnion(user.uid),
        });
      });


      await addDoc(collection(db, "registrations"), {
        userId: user.uid,
        tournamentId: tournament.id,
        title: tournament.title,
        date: tournament.date ?? null,
        location: tournament.location ?? "",
        registration_date: serverTimestamp(),
      });

      refreshData?.(); 
      alert("Successfully registered!");
    } catch (err) {
      console.error(err);
      alert(err.message || "Registration failed.");
    }
  };

  return (
    <div className="map-container">
      <MapContainer
        ref={mapRef}
        center={initialCenter}
        zoom={2}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />

        {points.map((t) => (
          <Marker key={t.id} position={t.coord} icon={CustomMarkerIcon}>
            <Popup>
              <div className="map-popup-content">
                <h3>{t.title}</h3>
                <p>Date: {formatDate(t.date)}</p>
                <p>Location: {t.location}</p>
                <p>Spots left: {t.available_spots}</p>

                <button
                  className="register-button"
                  disabled={
                    t.available_spots <= 0 ||
                    t.participants?.includes(user?.uid)
                  }
                  onClick={() => registerForTournament(t)}
                >
                  {t.participants?.includes(user?.uid)
                    ? "Registered"
                    : t.available_spots > 0
                    ? "Register"
                    : "Full"}
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default TournamentMap;
