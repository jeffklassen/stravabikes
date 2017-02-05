import { MongoClient } from 'mongodb';

const dbURL = 'mongodb://localhost:27017/strava';
let db;
const getDB = () => {
    return MongoClient.connect(dbURL)
        .then(database => {
            db = database;
            return db;
        });
};
const handleErr = err => {
    db.close();
    throw err;
};
const getCollection = (collName) => {
    if (typeof collName == 'string' && (collName == 'activity' || collName == 'athlete')) {
        return getDB().then(db => {
            return db.collection(collName);
        });
    }
};

const insertObjectToCollection = (object, collection) => {
    return getCollection(collection)
        .then(collection => {
            return collection.insertOne(object);
        })
        .then(() => {
            db.close();
            return object;
        })
        .catch(handleErr);
};

const insertActivity = (activity) => {
    return insertObjectToCollection(activity, 'activity');
};
const insertAthlete = (athlete) => {
    return insertObjectToCollection(athlete, 'athlete');
};

const listAthleteActivities = (athleteId) => {
    return getCollection('activity')
        .then(activityColl => {
            return activityColl
                .find({ 'athlete.id': { '$eq': athleteId } })
                .toArray();
        })
        .then(activities => {
            db.close();
            return activities;
        })
        .catch(handleErr);
};
listAthleteActivities(1234).then(console.log);

export { insertActivity, insertAthlete, listAthleteActivities };