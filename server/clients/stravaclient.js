import axios from "axios";
import { config } from "../config/config.js";

const stravaAPIURL = "https://www.strava.com/api/v3/";
async function getAuthToken(authCode) {
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
}

async function fullStravaActivities(authId) {
  const stravaActivityUrl = stravaAPIURL + "activities";
  const headers = { Authorization: `Bearer ${authId}` };

  let params = { per_page: 200 };
  let stravaActivities = [];
  let morePages = true;
  let pageCounter = 1;

  while (morePages) {
    params.page = pageCounter;
    try {
      let response = await axios
        .get(stravaActivityUrl)
        .query(params)
        .set(headers);
      let activities = response.body;
      stravaActivities = stravaActivities.concat(activities);
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
  stravaActivities = stravaActivities.map((activity) => {
    activity._id = activity.id;
    return activity;
  });
  return stravaActivities;
}

async function getAthlete(authId) {
  const stravaAthleteUrl = stravaAPIURL + "athlete";
  const headers = { Authorization: `Bearer ${authId}` };

  let athlete;
  try {
    let response = await axios.get(stravaAthleteUrl, { headers });

    console.log("RESPONSE");
    console.log(response.body);

    athlete = response.body;
  } catch (err) {
    console.error(err.response.data);
  }
  console.log("ATHLETE RESPONSE BODY");
  console.log(athlete);
  return athlete;
}

export { getAthlete, fullStravaActivities, getAuthToken };
