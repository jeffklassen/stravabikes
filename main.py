import serviceCalls
import mongoclient

def insert_strava_db(stravaActivities_list):
    counter = 1
    for record in stravaActivities_list:
        mongoclient.insert_activity(record)
        counter += 1
    
    print(counter)

def main():
    
    #request full data for athlete, returns a list
    #data = serviceCalls.fullstravaActivities('3db92dcc937476ff0a68ab3cc6c1c47f4bd988e6')

    #count records in the list
    #count = serviceCalls.countRecords(data)
    
    #insert each record into the DB
    #insert_strava_db(data)
 
    #print activities in DB
    #mongoclient.list_athlete_activities(3231940)

    #get athlete
    response = serviceCalls.getAthlete('3db92dcc937476ff0a68ab3cc6c1c47f4bd988e6')
    print(response)
    
main()


