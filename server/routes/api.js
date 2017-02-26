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
            .then(athleteId => {
                
            });
    });



    apiRoutes.use((req, res, next) => {
        let authToken = req.cookies.sessionId;
        if (!authToken) {
            console.log('authentication failed');
            res.status(403);
            res.send('¡No debe pasar!');
        }
        else {
            authController
                .authenticate(req.cookies.sessionId)
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
