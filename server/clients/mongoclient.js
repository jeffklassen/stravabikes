import { MongoClient } from "mongodb";
import config from "../config/config";

const dbURL = config.mongo.url;
const collectionNames = {
  athlete: "athlete",
  activity: "activity",
  session: "session",
};

async function getDB() {
  let db = await MongoClient.connect(dbURL);
  return db;
}

async function getCollection(db, collName) {
  // if (typeof collName == 'string' && (collName == 'activity' || collName == 'athlete')) {
  return db.collection(collName);
  /*}
    else {
        return Promise.reject('collname must be either activity or athlete');
    }*/
}

async function insertObjectToCollection(obj, collName) {
  let db = await getDB();
  let collection = await getCollection(db, collName);

  await collection.update({ _id: obj._id }, obj, { upsert: true });
  db.close();
  return obj;
}

async function getSessionData(sessionId) {
  let db = await getDB();

  let collection = await getCollection(db, collectionNames.session);

  let sessionData = await collection.findOne({ sessionId: { $eq: sessionId } });

  db.close();
  return sessionData;
}
async function mapTokenToAthlete(athleteId, accessToken, sessionId) {
  let mapping = { athleteId, accessToken, sessionId };
  mapping._id = athleteId;
  return insertObjectToCollection(mapping, collectionNames.session);
}

async function getAthlete(athleteId) {
  let db = await getDB();

  let collection = await getCollection(db, collectionNames.athlete);

  let athlete = await collection.findOne({ _id: { $eq: athleteId } });

  db.close();
  return athlete;
}

async function insertActivities(activities) {
  let db = await getDB();
  let collection = await getCollection(db, collectionNames.activity);
  let batch = collection.initializeUnorderedBulkOp();

  for (let activity of activities) {
    batch.find({ _id: activity._id }).upsert().updateOne(activity);
  }
  await batch.execute();
  db.close();
  return activities;
}
async function listAthleteRides(athleteId) {
  let db = await getDB();

  let collection = await getCollection(db, collectionNames.activity);
  let activities = await collection
    .find(
      {
        "athlete.id": athleteId,
        type: "Ride",
      },
      {
        start_date_local: 1,
        moving_time: 1,
        total_elevation_gain: 1,
        distance: 1,
        gear_id: 1,
        gear: 1,
      }
    )
    .sort({ start_date_local: 1 })
    .toArray();

  db.close();
  return activities;
}
const insertAthlete = (athlete) => {
  return insertObjectToCollection(athlete, collectionNames.athlete);
};

async function rideAggregation(athleteId, field) {
  let db = await getDB();

  let collection = await getCollection(db, collectionNames.activity);

  let prom = await collection
    .aggregate([
      { $match: { "athlete.id": athleteId, type: "Ride" } },
      { $group: { _id: "$gear_id", total: { $sum: "$" + field } } },
      { $project: { field: field, total: 1 } },
    ])
    .toArray();

  db.close();
  return prom;
}

export {
  insertActivities,
  insertAthlete,
  listAthleteRides,
  getAthlete,
  rideAggregation,
  mapTokenToAthlete,
  getSessionData,
};
