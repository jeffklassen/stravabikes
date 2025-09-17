import express, { Request, Response, NextFunction, Application } from 'express';
import config from '../config/config';
import athleteController from '../controllers/athleteController';
import authController from '../controllers/authController';
import { AuthenticatedRequest } from '../../../types/api';

const clientRoutes = express.Router();
const apiRoutes = express.Router();

export default function setupRoutes(app: Application): void {
  apiRoutes.get('/authDetails', async (req: Request, res: Response) => {
    try {
      const authDetails = await authController.getAuthDetails();
      res.send(authDetails);
    } catch (error) {
      res.status(500).send({ error: 'Failed to get auth details' });
    }
  });

  apiRoutes.post('/connectToStrava', async (req: Request, res: Response) => {
    try {
      const sessionId = await authController.connectToStrava(req.body.authCode);
      res.cookie('sessionId', sessionId);
      res.send({ loggedIn: true });
    } catch (e) {
      res.status(500).send({ status: 'unable to authenticate', error: e });
    }
  });

  // Authentication middleware
  apiRoutes.use(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const sessionId = req.cookies.sessionId;

    if (!sessionId) {
      console.log('authentication failed');
      res.status(403).send('¡No debe pasar!');
      return;
    }

    try {
      const sessionData = await authController.isAuthenticated(req.cookies.sessionId);
      console.log('authentication success', sessionData);
      req.sessionData = sessionData;
      next();
    } catch (err) {
      console.log('authentication failed', err);
      res.status(403).send('¡No debe pasar!');
    }
  });

  apiRoutes.get('/isAuthenticated', (req: AuthenticatedRequest, res: Response) => {
    if (req.sessionData && req.sessionData.athleteId) {
      res.send({ loggedIn: true });
    } else {
      res.status(401).send();
    }
  });

  apiRoutes.post('/logout', (req: Request, res: Response) => {
    res.clearCookie('sessionId');
    res.send({ loggedOut: true });
  });

  apiRoutes.get('/loadActivities', async (req: AuthenticatedRequest, res: Response) => {
    try {
      if (!req.sessionData || !req.sessionData.sessionId) {
        return res.status(401).send('Not authenticated');
      }

      // Get a valid access token (refreshing if needed)
      const accessToken = await authController.getValidAccessToken(req.sessionData.sessionId);
      if (!accessToken) {
        return res.status(401).send('Unable to get valid access token');
      }

      const activities = await athleteController.loadActivities(accessToken);
      res.send({ activityCount: activities.length });
    } catch (error) {
      res.status(500).send({ error: 'Failed to load activities' });
    }
  });

  apiRoutes.get('/athlete', async (req: AuthenticatedRequest, res: Response) => {
    try {
      if (!req.sessionData) {
        return res.status(401).send('Not authenticated');
      }

      const athlete = await athleteController.getAthlete(req.sessionData.athleteId);
      res.send(athlete);
    } catch (error) {
      res.status(500).send({ error: 'Failed to get athlete' });
    }
  });

  apiRoutes.get('/athleteSummary', async (req: AuthenticatedRequest, res: Response) => {
    try {
      if (!req.sessionData) {
        return res.status(401).send('Not authenticated');
      }

      const summary = await athleteController.getSummary(req.sessionData.athleteId);
      res.send(summary);
    } catch (err) {
      res.status(500).send(err);
    }
  });

  apiRoutes.get('/activities', async (req: AuthenticatedRequest, res: Response) => {
    try {
      if (!req.sessionData) {
        return res.status(401).send('Not authenticated');
      }

      const activities = await athleteController.getActivities(req.sessionData.athleteId);
      res.send(activities);
    } catch (err) {
      res.status(500).send(err);
    }
  });

  app.use('/api', apiRoutes);
}