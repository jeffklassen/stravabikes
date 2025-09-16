import * as request from 'superagent';

export default {
    loadActivities: () => {
        return request.get('/api/loadActivities');
    }
};
