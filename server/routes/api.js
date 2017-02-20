const express = require('express');
const config = require('../config/config').options;

import athleteController from '../controllers/athleteController';
let clientRoutes = express.Router();
let apiRoutes = express.Router();

module.exports = app => {


    apiRoutes.get('/athlete', (req, res) => {
        athleteController.getAthlete()
            .then(athlete => {
                res.send(athlete);
            });

    });
    apiRoutes.get('/athleteSummary', (req, res) => {
        athleteController.getSummary()
            .then(data => {
                res.send(data);
            })
            .catch(err => {
                res.status(500);
                res.send(err);
            });

    });
    apiRoutes.get('/activities', (req, res) => {
        athleteController.getActivities()
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
