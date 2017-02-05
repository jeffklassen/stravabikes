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
    let activities = await collection.find({ 'athlete.id': { '$eq': athleteId } })
        .toArray();

    db.close();
    return activities;

}



export { insertActivities, insertAthlete, listAthleteActivities };