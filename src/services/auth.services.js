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

  changePassword: (payload) =>
    handleRequest(api.patch("/users/change-password", payload)),

  forgotPassword: (email) =>
    handleRequest(api.post("/users/forgot-password", { email })),

  resetPassword: (token, newPassword) =>
    handleRequest(
      api.post(`/users/reset-password/${token}`, { newPassword })
    ),

  setDailyGoal: (dailyLessonGoal) =>
    handleRequest(api.patch("/users/daily-goal", { dailyLessonGoal })),

  updateProfile: (payload) =>
    handleRequest(
      api.patch("/users/update-profile", payload, {
        headers: { "Content-Type": "multipart/form-data" },
      })
    ),
};
