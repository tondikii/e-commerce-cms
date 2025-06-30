import axios from "axios";

export const api = axios.create({
  baseURL: "/api/",
  timeout: 325000,
  headers: {"X-Requested-With": "XMLHttpRequest"},
});
