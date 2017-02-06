const express = require('express');
const config = require('../config/config').options;
const clientRoutes = express.Router();
module.exports = app => {
    clientRoutes.get('/app/', function (req, res) {
        res.sendFile('/client/index.html', config);
    });
    clientRoutes.get('/client/*', function (req, res) {
        res.sendFile(req.path, config);
    });
    clientRoutes.get('*', function (req, res) {
        res.sendFile('/client/index.html', config);
    });
    app.use('/', clientRoutes);
};