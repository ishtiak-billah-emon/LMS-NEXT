import api from "@/lib/api";

const handleRequest = async (request) => {
  try {
    const { data } = await request;
    return data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const authService = {
  login: (credentials) => handleRequest(api.post("/users/login", credentials)),

  register: (userData) => handleRequest(api.post("/users/register", userData)),

  logout: () => handleRequest(api.post("/users/logout")),

  getCurrentUser: () => handleRequest(api.get("/users/current-user")),

  refreshToken: () => handleRequest(api.post("/users/refresh-token")),
};
