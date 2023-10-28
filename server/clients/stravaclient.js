import axios from "axios";
import { config } from "../config/config.js";

const stravaAPIURL = "https://www.strava.com/api/v3/";
const authenticateAndRetrieveAthlete = async (authCode) => {
  try {
    const params = {
      client_id: config.strava.authProvider.clientId,
      client_secret: config.strava.clientSecret,
      code: authCode,
      grant_type: "authorization_code",
    };
    console.log("getAuthToken", params);
    const response = await axios.post(
      "https://www.strava.com/oauth/token",
      params
    );

    console.log("getAuthToken response", response.data);

    return {
      access_token: response.data.access_token,
      athlete: response.data.athlete,
    };
  } catch (err) {
    console.error(err.response.data);
  }
};

async function fullStravaActivities(access_token) {
  const stravaActivityUrl = stravaAPIURL + "activities";
  const headers = { Authorization: `Bearer ${access_token}` };

  let params = { per_page: 40 };
  let stravaActivities = [];
  let morePages = true;
  let pageCounter = 1;

  while (morePages) {
    params.page = pageCounter;
    try {
      let response = await axios.get(stravaActivityUrl, {
        headers,
        query: params,
      });

      let activities = response.data;
      console.log("activities", activities.length);
      stravaActivities.push(...activities);
      pageCounter++;
      console.log("page returned, got", activities.length);
      if (activities.length < params.per_page) {
        morePages = false;
      }
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  return stravaActivities;
}

export { fullStravaActivities, authenticateAndRetrieveAthlete };
