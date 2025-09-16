"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.listAthleteActivities = exports.insertAthlete = void 0;
exports.insertActivities = insertActivities;
exports.listAthleteRides = listAthleteRides;
exports.getAthlete = getAthlete;
exports.rideAggregation = rideAggregation;
exports.mapTokenToAthlete = mapTokenToAthlete;
exports.getSessionData = getSessionData;
const mongodb_1 = require("mongodb");
const config_1 = __importDefault(require("../config/config"));
const dbURL = config_1.default.mongo.url;
const collectionNames = {
    athlete: 'athlete',
    activity: 'activity',
    session: 'session'
};
async function getDB() {
    const client = await mongodb_1.MongoClient.connect(dbURL);
    return client.db();
}
async function getCollection(db, collName) {
    return db.collection(collName);
}
async function insertObjectToCollection(obj, collName) {
    const db = await getDB();
    const collection = await getCollection(db, collName);
    await collection.updateOne({ _id: obj._id }, { $set: obj }, { upsert: true });
    await db.client.close();
    return obj;
}
async function getSessionData(sessionId) {
    const db = await getDB();
    const collection = await getCollection(db, collectionNames.session);
    const sessionData = await collection.findOne({ sessionId: { $eq: sessionId } });
    await db.client.close();
    return sessionData;
}
async function mapTokenToAthlete(athleteId, accessToken, sessionId) {
    const mapping = {
        _id: athleteId,
        athleteId,
        accessToken,
        sessionId
    };
    return insertObjectToCollection(mapping, collectionNames.session);
}
async function getAthlete(athleteId) {
    const db = await getDB();
    const collection = await getCollection(db, collectionNames.athlete);
    const athlete = await collection.findOne({ _id: { $eq: athleteId } });
    await db.client.close();
    return athlete;
}
async function insertActivities(activities) {
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
async function listAthleteRides(athleteId) {
    const db = await getDB();
    const collection = await getCollection(db, collectionNames.activity);
    const activities = await collection
        .find({
        'athlete.id': athleteId,
        type: 'Ride'
    }, {
        projection: {
            start_date_local: 1,
            moving_time: 1,
            total_elevation_gain: 1,
            distance: 1,
            gear_id: 1,
            gear: 1
        }
    })
        .sort({ start_date_local: 1 })
        .toArray();
    await db.client.close();
    return activities;
}
const insertAthlete = (athlete) => {
    return insertObjectToCollection(athlete, collectionNames.athlete);
};
exports.insertAthlete = insertAthlete;
async function rideAggregation(athleteId, field) {
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
exports.listAthleteActivities = listAthleteActivities;
//# sourceMappingURL=mongoclient.js.map