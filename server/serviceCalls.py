import requests
import sys
import json

def fullstravaActivities(authID):
    #returns all results for an athlete, outputs to a list
    strava_act= 'https://www.strava.com/api/v3/athlete/activities'
    authID = '3db92dcc937476ff0a68ab3cc6c1c47f4bd988e6'
    headers = {"Authorization": "Bearer {}".format(authID)}
    params = {'per_page' : 25}

    stravaActivities = []

   
    more_pages = True
    page_counter = 1
    
    while more_pages:
        params = {'page' : page_counter}
        response = requests.get(strava_act, headers = headers, params = params)
        try:
            content = response.json()
            stravaActivities.extend(content)
            page_counter += 1
            if len(content) < 25:
                more_pages = False           
        except:
            raise ValueError('Unexpected response from Strava : Not a JSON object.')   

    return(stravaActivities)

def stravaActivities(authID, page):
    """Takes a specified page, and returns 25 results
    """

    strava_act= 'https://www.strava.com/api/v3/athlete/activities'
    authID = '3db92dcc937476ff0a68ab3cc6c1c47f4bd988e6'
    headers = {"Authorization": "Bearer {}".format(authID)}
    
    
    #if only one page is specified
    params = {'page' : page, 'per_page' : 25}
    response = requests.get(strava_act, headers = headers, params = params)
    try:
        stravaActivities = response.json()
    except:
        raise ValueError('Unexpected response from Strava : Not a JSON object.')

    return(stravaActivities)


def countRecords(records):
    #counts activities 
    count = len(records)
    return(count)


def getAthlete(authID):
     strava_athlete = 'https://www.strava.com/api/v3/athlete'
     headers = {"Authorization": "Bearer {}".format(authID)}
     response = requests.get(strava_athlete, headers = headers)

     try:
        stravaAthlete = response.json()
     except:
        raise ValueError('Unexpected response from Strava : Not a JSON object.')

     return(stravaAthlete)