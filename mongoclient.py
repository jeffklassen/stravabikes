"""Handle CRUD actions to/from MongoDB """
import json
from pymongo import MongoClient

def get_DB():
    """Connect to mongoDB """
    client = MongoClient('localhost', 27017)
    return client.strava

def get_activity_collection(db):
    return db.activity

def insert_activity(activity):
    collection = get_activity_collection( get_DB())
    insertion = collection.insert_one(activity)
    print insertion

def list_activities():
    collection = get_activity_collection( get_DB())
    for activity in collection.find():
        print(activity)

#insert_activity(activity)

list_activities()