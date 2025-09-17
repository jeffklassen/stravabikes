"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = setupRoutes;
const express_1 = __importDefault(require("express"));
const athleteController_1 = __importDefault(require("../controllers/athleteController"));
const authController_1 = __importDefault(require("../controllers/authController"));
const clientRoutes = express_1.default.Router();
const apiRoutes = express_1.default.Router();
function setupRoutes(app) {
    apiRoutes.get('/authDetails', async (req, res) => {
        try {
            const authDetails = await authController_1.default.getAuthDetails();
            res.send(authDetails);
        }
        catch (error) {
            res.status(500).send({ error: 'Failed to get auth details' });
        }
    });
    apiRoutes.post('/connectToStrava', async (req, res) => {
        try {
            const sessionId = await authController_1.default.connectToStrava(req.body.authCode);
            res.cookie('sessionId', sessionId);
            res.send({ loggedIn: true });
        }
        catch (e) {
            res.status(500).send({ status: 'unable to authenticate', error: e });
        }
    });
    // Authentication middleware
    apiRoutes.use(async (req, res, next) => {
        console.log(req.url, 'requested');
        const sessionId = req.cookies.sessionId;
        if (!sessionId) {
            console.log('authentication failed');
            res.status(403).send('¡No debe pasar!');
            return;
        }
        try {
            const sessionData = await authController_1.default.isAuthenticated(req.cookies.sessionId);
            console.log('authentication success', sessionData);
            req.sessionData = sessionData;
            next();
        }
        catch (err) {
            console.log('authentication failed', err);
            res.status(403).send('¡No debe pasar!');
        }
    });
    apiRoutes.get('/isAuthenticated', (req, res) => {
        if (req.sessionData && req.sessionData.athleteId) {
            res.send({ loggedIn: true });
        }
        else {
            res.status(401).send();
        }
    });
    apiRoutes.get('/loadActivities', async (req, res) => {
        try {
            if (!req.sessionData || !req.sessionData.sessionId) {
                return res.status(401).send('Not authenticated');
            }
            // Get a valid access token (refreshing if needed)
            const accessToken = await authController_1.default.getValidAccessToken(req.sessionData.sessionId);
            if (!accessToken) {
                return res.status(401).send('Unable to get valid access token');
            }
            const activities = await athleteController_1.default.loadActivities(accessToken);
            res.send({ activityCount: activities.length });
        }
        catch (error) {
            res.status(500).send({ error: 'Failed to load activities' });
        }
    });
    apiRoutes.get('/athlete', async (req, res) => {
        try {
            if (!req.sessionData) {
                return res.status(401).send('Not authenticated');
            }
            const athlete = await athleteController_1.default.getAthlete(req.sessionData.athleteId);
            res.send(athlete);
        }
        catch (error) {
            res.status(500).send({ error: 'Failed to get athlete' });
        }
    });
    apiRoutes.get('/athleteSummary', async (req, res) => {
        try {
            if (!req.sessionData) {
                return res.status(401).send('Not authenticated');
            }
            const summary = await athleteController_1.default.getSummary(req.sessionData.athleteId);
            res.send(summary);
        }
        catch (err) {
            res.status(500).send(err);
        }
    });
    apiRoutes.get('/activities', async (req, res) => {
        try {
            if (!req.sessionData) {
                return res.status(401).send('Not authenticated');
            }
            const activities = await athleteController_1.default.getActivities(req.sessionData.athleteId);
            res.send(activities);
        }
        catch (err) {
            res.status(500).send(err);
        }
    });
    app.use('/api', apiRoutes);
}
//# sourceMappingURL=api.js.map