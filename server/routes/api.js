import express from 'express';
const config = require('../config/config').options;


import athleteController from '../controllers/athleteController';
import authController from '../controllers/authController';
let clientRoutes = express.Router();
let apiRoutes = express.Router();

module.exports = app => {

    apiRoutes.get('/authDetails', async (req, res) => {
        let authDetails = await authController.getAuthDetails();

        res.send(authDetails);

    });
    apiRoutes.post('/connectToStrava', async (req, res) => {
        try {
            let sessionId = await authController.connectToStrava(req.body.authCode);

            res.cookie('sessionId', sessionId);
            res.send({ loggedIn: true });
        }
        catch (e) {
            //console.log(e);
            res.status(500);
            res.send({ status: 'unable to authenticate', e });
        }
    });

    apiRoutes.use(async (req, res, next) => {
        console.log(req.url, 'requested');
        let sessionId = req.cookies.sessionId;
        if (!sessionId) {
            console.log('authentication failed');
            res.status(403);
            res.send('¡No debe pasar!');
        }
        else {
            try {
                let sessionData = await authController
                    .isAuthenticated(req.cookies.sessionId);

                console.log('authentication success', sessionData);
                req.sessionData = sessionData;
                next();
            }
            catch (err) {
                console.log('authentication failed', err);
                res.status(403);
                res.send('¡No debe pasar!');
            };
        }
    });

    apiRoutes.get('/isAuthenticated', (req, res) => {
        if (req.sessionData && req.sessionData.athleteId) {
            res.send({ loggedIn: true });
        }
        else { res.status(401).send(); }
    });
    apiRoutes.get('/loadActivities', async (req, res) => {
        let activities = await athleteController.loadActivities(req.sessionData.accessToken);

        res.send({ activityCount: activities.length });


    });
    apiRoutes.get('/athlete', async (req, res) => {
        let athlete = await athleteController.getAthlete(req.sessionData.athleteId);

        res.send(athlete);


    });
    apiRoutes.get('/athleteSummary', async (req, res) => {
        try {
            let summary = await athleteController.getSummary(req.sessionData.athleteId);

            res.send(summary);
        }
        catch (err) {
            res.status(500);
            res.send(err);
        };

    });
    apiRoutes.get('/activities', async (req, res) => {
        try {
            let activities = await athleteController.getActivities(req.sessionData.athleteId);

            res.send(activities);
        }

        catch (err) {
            res.status(500);
            res.send(err);
        };

    });
    app.use('/api', apiRoutes);


    clientRoutes.get('/Images*', function (req, res) {
        console.log('Images called');
        res.sendFile(req.path, config);
    });
    clientRoutes.get('/build*', function (req, res) {
        console.log('build called');
        res.sendFile(req.path, config);
    });

    clientRoutes.get('/*', function (req, res) {
        console.log('splat called');
        res.sendFile('index.html', config);
    });

    app.use('/', clientRoutes);

};
