const express = require('express');
const config = require('../config/config').options;

import bikeController from '../controllers/bikeController';
let clientRoutes = express.Router();
let apiRoutes = express.Router();

module.exports = app => {

    apiRoutes.get('/bikecount', (req, res) => {
        bikeController.getBikeCount()
            .then(count => {
                res.send({ bikeCount: count });
            });
       
    });

    app.use('/api', apiRoutes);


    clientRoutes.get('/client/*', function (req, res) {
        res.sendFile(req.path, config);
    });
    
    app.use('/', clientRoutes);
};
