import https from "./https";
// re-write or customize this based on your requirement!
class Services {
  static login = (payload) => https.post("/auth/login", payload);
  static signup = (payload) => https.post("/auth/signup", payload);
  static refreshToken = (payload) => https.post("/auth/refresh-token", payload);
  static getUser = (userId) => https.get(`/users/${userId}`);
  static getAllUsers = (params) => https.get("/users", { params });
  static updateUser = (userId, payload) =>
    https.put(`/users/${userId}`, payload);
  static deleteUser = (userId) => https.delete(`/users/${userId}`);
  static logout = () => https.post("/auth/logout");
}

export default Services;
