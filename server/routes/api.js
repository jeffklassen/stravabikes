const express = require('express');
const config = require('../config/config').options;

import bikeController from '../controllers/bikeController';
import athleteController from '../controllers/athleteController';
let clientRoutes = express.Router();
let apiRoutes = express.Router();

module.exports = app => {

    apiRoutes.get('/bikecount', (req, res) => {
        bikeController.getBikeCount()
            .then(count => {
                res.send({ bikeCount: count });
            });

    });

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

    app.use('/api', apiRoutes);


    clientRoutes.get('/client/*', function (req, res) {
        res.sendFile(req.path, config);
    });

    app.use('/', clientRoutes);
};
