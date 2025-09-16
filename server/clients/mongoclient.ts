import { MongoClient, Db, Collection } from 'mongodb';
import config from '../config/config';
import { MongoCollectionNames, SessionData, AthleteDocument, ActivityDocument } from '../../types/models';
import { StravaActivity, StravaAthlete } from '../../types/strava';

const dbURL = config.mongo.url;
const collectionNames: MongoCollectionNames = {
  athlete: 'athlete',
  activity: 'activity',
  session: 'session'
};

async function getDB(): Promise<Db> {
  const client = await MongoClient.connect(dbURL);
  return client.db();
}

async function getCollection(db: Db, collName: string): Promise<Collection> {
  return db.collection(collName);
}

async function insertObjectToCollection(obj: any, collName: string): Promise<any> {
  const db = await getDB();
  const collection = await getCollection(db, collName);

  await collection.updateOne({ _id: obj._id }, { $set: obj }, { upsert: true });
  await db.client.close();
  return obj;
}

async function getSessionData(sessionId: string): Promise<SessionData | null> {
  const db = await getDB();
  const collection = await getCollection(db, collectionNames.session);
  const sessionData = await collection.findOne({ sessionId: { $eq: sessionId } }) as SessionData | null;
  await db.client.close();
  return sessionData;
}

async function mapTokenToAthlete(athleteId: number, accessToken: string, sessionId: string): Promise<SessionData> {
  const mapping: SessionData = {
    _id: athleteId,
    athleteId,
    accessToken,
    sessionId
  };
  return insertObjectToCollection(mapping, collectionNames.session);
}

async function getAthlete(athleteId: number): Promise<AthleteDocument | null> {
  const db = await getDB();
  const collection = await getCollection(db, collectionNames.athlete);
  const athlete = await collection.findOne({ _id: { $eq: athleteId } }) as AthleteDocument | null;
  await db.client.close();
  return athlete;
}

async function insertActivities(activities: StravaActivity[]): Promise<StravaActivity[]> {
  const db = await getDB();
  const collection = await getCollection(db, collectionNames.activity);

  const operations = activities.map(activity => ({
    updateOne: {
      filter: { _id: activity._id },
      update: { $set: activity },
      upsert: true
    }
  }));

  if (operations.length > 0) {
    await collection.bulkWrite(operations);
  }

  await db.client.close();
  return activities;
}

async function listAthleteRides(athleteId: number): Promise<ActivityDocument[]> {
  const db = await getDB();
  const collection = await getCollection(db, collectionNames.activity);

  const activities = await collection
    .find(
      {
        'athlete.id': athleteId,
        type: 'Ride'
      },
      {
        projection: {
          start_date_local: 1,
          moving_time: 1,
          total_elevation_gain: 1,
          distance: 1,
          gear_id: 1,
          gear: 1
        }
      }
    )
    .sort({ start_date_local: 1 })
    .toArray() as ActivityDocument[];

  await db.client.close();
  return activities;
}

const insertAthlete = (athlete: StravaAthlete): Promise<StravaAthlete> => {
  return insertObjectToCollection(athlete, collectionNames.athlete);
};

async function rideAggregation(athleteId: number, field: string): Promise<any[]> {
  const db = await getDB();
  const collection = await getCollection(db, collectionNames.activity);

  const results = await collection.aggregate([
    { $match: { 'athlete.id': athleteId, type: 'Ride' } },
    { $group: { _id: '$gear_id', total: { $sum: `$${field}` } } },
    { $project: { field: field, total: 1 } }
  ]).toArray();

  await db.client.close();
  return results;
}

// For backwards compatibility
const listAthleteActivities = listAthleteRides;

export {
  insertActivities,
  insertAthlete,
  listAthleteRides,
  listAthleteActivities,
  getAthlete,
  rideAggregation,
  mapTokenToAthlete,
  getSessionData
};