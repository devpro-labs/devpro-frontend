import axios from "axios"
import { API_URL } from "./backend_route";

export const API = async(token?: string) => {

  const api = axios.create({
    baseURL: API_URL,
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    }
  });

  return api;
}