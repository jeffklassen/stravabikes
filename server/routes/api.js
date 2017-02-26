import express from 'express';
const config = require('../config/config').options;


import athleteController from '../controllers/athleteController';
import authController from '../controllers/authController';
let clientRoutes = express.Router();
let apiRoutes = express.Router();

module.exports = app => {

    apiRoutes.get('/clientId', (req, res) => {
        authController.getClientId()
            .then(clientId => {
                res.send({ clientId });
            });
    });
    apiRoutes.post('/connectToStrava', (req, res) => {

        authController
            .connectToStrava(req.body.authCode)
            .then(sessionId => {
                res.cookie('sessionId', sessionId);
                res.send({ loggedIn: true });
            });
    });



    apiRoutes.use((req, res, next) => {
        let sessionId = req.cookies.sessionId;
        if (!sessionId) {
            console.log('authentication failed');
            res.status(403);
            res.send('¡No debe pasar!');
        }
        else {
            authController
                .isAuthenticated(req.cookies.sessionId)
                .then(sessionData => {
                    console.log('authentication success', sessionData);
                    req.sessionData = sessionData;
                    next();
                })
                .catch(err => {
                    console.log('authentication failed', err);
                    res.status(403);
                    res.send('¡No debe pasar!');
                });
        }
    });


    apiRoutes.get('/loadActivities', (req, res) => {
        athleteController.loadActivities(req.sessionData.accessToken)
            .then((activites) => {
                res.send({activityCount: activites.length});
            });

    });
    apiRoutes.get('/athlete', (req, res) => {
        athleteController.getAthlete(req.sessionData.athleteId)
            .then(athlete => {
                res.send(athlete);
            });

    });
    apiRoutes.get('/athleteSummary', (req, res) => {
        athleteController.getSummary(req.sessionData.athleteId)
            .then(data => {
                res.send(data);
            })
            .catch(err => {
                res.status(500);
                res.send(err);
            });

    });
    apiRoutes.get('/activities', (req, res) => {
        athleteController.getActivities(req.sessionData.athleteId)
            .then(data => {
                res.send(data);
            })
            .catch(err => {
                res.status(500);
                res.send(err);
            });

    });
    app.use('/api', apiRoutes);


    clientRoutes.get('/client/*', function (req, res) {
        res.sendFile(req.path, config);
    });

    app.use('/', clientRoutes);

};
