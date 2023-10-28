import axios from "axios";

export default {
  loadActivities: () => {
    return axios.get("/api/loadActivities");
  },
  getActivities: () => {
    return axios.get("/api/activities");
  },
};
