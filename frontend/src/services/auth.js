import api from "./api";

export const registerUser = (payload) => api.post("/users/register", payload);
export const getUser = (roll) => api.get(`/users/${roll}`);
