import * as request from 'superagent';
import { StravaAthlete, StravaActivity } from '../../../types/strava';
import { AthleteDocument, ActivityDocument } from '../../../types/models';

interface SummaryAggregation {
  total: number;
  field: string;
}

interface AthleteSummaryResponse {
  body: {
    athlete: AthleteDocument;
    summary: SummaryAggregation[];
  };
}

interface AthleteResponse {
  body: AthleteDocument;
}

interface ActivitiesResponse {
  body: ActivityDocument[];
}

interface AthleteService {
  getAthlete: () => Promise<AthleteResponse>;
  getAthleteSummary: () => Promise<AthleteSummaryResponse>;
  getActivities: () => Promise<ActivitiesResponse>;
}

const athleteService: AthleteService = {
  getAthlete: (): Promise<AthleteResponse> => {
    return request.get('/api/athlete');
  },

  getAthleteSummary: (): Promise<AthleteSummaryResponse> => {
    return request.get('/api/athleteSummary');
  },

  getActivities: (): Promise<ActivitiesResponse> => {
    return request.get('/api/activities');
  }
};

export default athleteService;