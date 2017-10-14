import express from 'express';
const config = require('../config/config').options;


import athleteController from '../controllers/athleteController';
import authController from '../controllers/authController';
let clientRoutes = express.Router();
let apiRoutes = express.Router();

module.exports = app => {

    apiRoutes.get('/authDetails', (req, res) => {
        authController.getAuthDetails()
            .then(authDetails => {
                res.send(authDetails);
            });
    });
    apiRoutes.post('/connectToStrava', (req, res) => {

        authController
            .connectToStrava(req.body.authCode)
            .then(sessionId => {
                res.cookie('sessionId', sessionId);
                res.send({ loggedIn: true });
            })
            .catch(e => {
                console.log(e);
                res.status(500);
                res.send({status: 'unable to authenticate', e})    ;
            });
    });



    apiRoutes.use((req, res, next) => {
        console.log(req.url, 'requested');
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

    apiRoutes.get('/isAuthenticated', (req, res) => {
        if (req.sessionData && req.sessionData.athleteId) {
            res.send({ loggedIn: true });
        }
        else { res.status(401).send(); }
    });
    apiRoutes.get('/loadActivities', (req, res) => {
        athleteController.loadActivities(req.sessionData.accessToken)
            .then((activites) => {
                res.send({ activityCount: activites.length });
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
    app.use( '/api', apiRoutes);


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
