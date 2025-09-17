import * as request from 'superagent';
import config from '../config/config';
import { StravaActivity, StravaAthlete, StravaTokenResponse, StravaRequestParams } from '../../../types/strava';

const stravaAPIURL = 'https://www.strava.com/api/v3/';

async function getAuthToken(authCode: string): Promise<StravaTokenResponse> {
  const response = await request.post('https://www.strava.com/oauth/token')
    .send({
      client_id: config.strava.authProvider.clientId,
      client_secret: config.strava.clientSecret,
      scope: config.strava.authProvider.scope,
      code: authCode,
      grant_type: 'authorization_code'
    });

  return response.body as StravaTokenResponse;
}

async function fullStravaActivities(authId: string): Promise<StravaActivity[]> {
  const stravaActivityUrl = stravaAPIURL + 'activities';
  const headers = { Authorization: `Bearer ${authId}` };

  const params: StravaRequestParams & { page?: number } = { per_page: 200 };
  let stravaActivities: StravaActivity[] = [];
  let morePages = true;
  let pageCounter = 1;

  while (morePages) {
    params.page = pageCounter;
    try {
      const response = await request
        .get(stravaActivityUrl)
        .query(params)
        .set(headers);

      const activities: StravaActivity[] = response.body;
      stravaActivities = stravaActivities.concat(activities);
      pageCounter++;

      if (activities.length < (params.per_page || 200)) {
        morePages = false;
      }
    } catch (err) {
      throw err;
    }
  }

  stravaActivities = stravaActivities.map((activity: StravaActivity) => {
    activity._id = activity.id;
    return activity;
  });

  return stravaActivities;
}

async function getAthlete(authId: string): Promise<StravaAthlete> {
  const stravaAthleteUrl = stravaAPIURL + 'athlete';
  const headers = { Authorization: `Bearer ${authId}` };

  try {
    const response = await request
      .get(stravaAthleteUrl)
      .set(headers);

    const athlete: StravaAthlete = response.body;

    return athlete;
  } catch (err) {
    throw err;
  }
}

async function refreshToken(refreshToken: string): Promise<StravaTokenResponse> {
  const response = await request.post('https://www.strava.com/oauth/token')
    .send({
      client_id: config.strava.authProvider.clientId,
      client_secret: config.strava.clientSecret,
      grant_type: 'refresh_token',
      refresh_token: refreshToken
    });

  return response.body as StravaTokenResponse;
}

function isTokenExpired(expiresAt: number): boolean {
  const now = Math.floor(Date.now() / 1000);
  const bufferTime = 5 * 60; // 5 minutes buffer
  return now >= (expiresAt - bufferTime);
}

export { getAthlete, fullStravaActivities, getAuthToken, refreshToken, isTokenExpired };