import { MongoClient } from 'mongodb';

const dbURL = 'mongodb://localhost:27017/strava';

async function getDB() {
    let db = await MongoClient.connect(dbURL);
    return db;
}

async function getCollection(db, collName) {
    if (typeof collName == 'string' && (collName == 'activity' || collName == 'athlete')) {
        return db.collection(collName);
    }
    else {
        return Promise.reject('collname must be either activity or athlete');
    }
}

async function insertObjectToCollection(obj, collName) {
    let db = await getDB();
    let collection = await getCollection(db, collName);

    await collection.update({ _id: obj._id }, obj, { upsert: true });
    db.close();
    return obj;
}

async function insertActivities(activities) {
    let db = await getDB();
    let collection = await getCollection(db, 'activity');
    let batch = collection.initializeUnorderedBulkOp();

    for (let activity of activities) {
        batch.find({ _id: activity._id }).upsert().updateOne(activity);

    }
    await batch.execute();
    db.close();
    return activities;

}
const insertAthlete = (athlete) => {
    return insertObjectToCollection(athlete, 'athlete');
};

async function listAthleteActivities(athleteId) {
    let db = await getDB();
    let collection = await getCollection(db, 'activity');
    let activities = await collection.find({ 'athlete.id': athleteId, type: 'Ride' })
        .toArray();

    db.close();
    return activities;
}

async function getAthlete(athleteId) {
    let db = await getDB();
    let collection = await getCollection(db, 'athlete');
    let athlete = await collection.findOne({ '_id': { '$eq': athleteId } });

    db.close();
    return athlete;
}

async function rideAggregation(athleteId, field) {
    let db = await getDB();
    let collection = await getCollection(db, 'activity');
    let prom = await collection.aggregate([
        { $match: { 'athlete.id': athleteId, type: 'Ride' } },
        { $group: { _id: '$gear_id', total: { $sum: '$' + field } } }
    ]).toArray();

    db.close();
    return prom;
}


export {
    insertActivities,
    insertAthlete,
    listAthleteActivities,
    getAthlete,
    rideAggregation
};