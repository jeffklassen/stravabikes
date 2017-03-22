import * as request from 'superagent';
export default {
    completeLoginWithStrava: (authCode) => {
        return request.post('api/connectToStrava')
            .send({ authCode });
    },
    getStravaAuthDetails: () => {
        return request.get('api/authDetails');
    }
};

