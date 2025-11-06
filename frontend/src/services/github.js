import api from "./api";

export const analyzeGithub = (token) =>
  api.get("/github/analyze", {
    headers: { Authorization: `Bearer ${token}` },
  });
