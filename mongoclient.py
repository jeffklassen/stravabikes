"""Handle CRUD actions to/from MongoDB """
import json
from pymongo import MongoClient

def get_DB():
    """Connect to mongoDB """
    client = MongoClient('localhost', 27017)
    return(client.strava)

def get_activity_collection(db):
    return(db.activity)

def insert_activity(activity):
    collection = get_activity_collection(get_DB())
    insertion = collection.insert_one(activity)

def list_activities():
    collection = get_activity_collection(get_DB())
    for activity in collection.find():
        print(activity)

def list_athlete_activities(athleteID):
    collection = get_activity_collection(get_DB())
    for activity in collection.find({"athlete.id": {"$eq" : athleteID}}):
        print(activity)

list_activities()