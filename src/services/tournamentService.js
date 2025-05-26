import axios from "axios";

export const fetchTournaments = async () => {
  try {
    const response = await axios.get("http://localhost:5000/api/tournaments");
    return response.data;
  } catch (error) {
    console.error("Error fetching tournaments:", error);
    throw error;
  }
};