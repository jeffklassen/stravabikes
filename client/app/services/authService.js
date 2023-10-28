import axios from "axios";
export default {
  completeLoginWithStrava: (authCode) => {
    return axios.post("/api/connectToStrava", { authCode });
  },
  getStravaAuthDetails: () => {
    return axios.get("/api/authDetails");
  },
  isAuthenticated: () => {
    return axios.get("/api/isAuthenticated");
  },
};
