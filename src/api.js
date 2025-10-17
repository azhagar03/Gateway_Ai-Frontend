import axios from "axios";

const API_BASE = "https://gateway-ai-backend.onrender.com/api";

export const api = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" },
});
