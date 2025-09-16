import * as request from 'superagent';

interface LoadActivitiesResponse {
  body: {
    activityCount: number;
  };
}

interface ActivitiesService {
  loadActivities: () => Promise<LoadActivitiesResponse>;
}

const activitiesService: ActivitiesService = {
  loadActivities: (): Promise<LoadActivitiesResponse> => {
    return request.get('/api/loadActivities');
  }
};

export default activitiesService;