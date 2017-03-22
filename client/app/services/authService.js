import * as request from 'superagent';
export default {
    completeLoginWithStrava: (authCode) => {
        return request.post('api/connectToStrava')
            .send({ authCode });
    }
};

