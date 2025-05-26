import React, { useState } from "react";
import { toast } from "react-toastify";

export default function AdminTournamentForm({
  tournament = null,          
  onSubmit,                    
  onCancel,                    
}) {
  const [formData, setFormData] = useState({
    title: tournament?.title ?? "",
    date:  tournament?.date
    ? tournament.date.toISOString().substring(0, 10): "",
    location: tournament?.location  ?? "",
    available_spots: tournament?.available_spots ?? 0,
  });


  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });


  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      available_spots: Number(formData.available_spots),
      date: formData.date ? new Date(formData.date) : null,
    };

    try {
      await onSubmit(payload);                         
      toast.success(tournament ? "Tournament updated!" : "Tournament created!");

      if (tournament && onCancel) {
        onCancel();                                   
      } else {
        setFormData({ title: "", date: "", location: "", available_spots: 0 });
      }
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Something went wrong");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="admin-tournament-form">
      <label>
        Title
        <input
          required
          name="title"
          placeholder="Tournament title"
          value={formData.title}
          onChange={handleChange}
        />
      </label>
      <br></br>
      <label>
        Date
        <input
          type="date"
          name="date"
          placeholder="YYYY-MM-DD"
          value={formData.date}
          onChange={handleChange}
        />
      </label>
      <br></br>
      <label>
        Location
        <input
          name="location"
          placeholder="City / Arena"
          value={formData.location}
          onChange={handleChange}
        />
      </label>
      <br></br>
      <label>
        Available spots
        <input
          type="number"
          min="0"
          name="available_spots"
          placeholder="0"
          value={formData.available_spots}
          onChange={handleChange}
        />
      </label>

      <button type="submit">
        {tournament ? "Save changes" : "Create"}
      </button>

      {tournament && (
        <button
          type="button"
          style={{ marginLeft: 8 }}
          onClick={() => onCancel && onCancel()}
        >
          Cancel
        </button>
      )}
    </form>
  );
}
