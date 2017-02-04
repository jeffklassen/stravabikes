import requests
import sys
import json

def validateParams(dateRange = '', relative= '', page = '', per_page = 25):
    """Validates parameters before hitting Strava API"""

    #verify params and dateRange correct
    if dateRange and relative:
        if relative == "before" or relative == "after": 
            if type(dateRange) == int: 
                params = {relative: dateRange, per_page : per_page}
            else: raise ValueError('Need to supply an integer for the date range.')
        else: raise ValueError("Please supply a correct parameter: must be before or after.")

    elif dateRange or relative:
        raise ValueError("Please supply both a date range and parameters")

    #verify page is correct   
    elif page:
        if type(page) ==int:
            params = {page : page, per_page : per_page}
        else: raise ValueError("Please supply an integer for the page you would like.")     

    #if no params specified, create params for default   
    else: 
        params = {per_page : per_page}


    return(params)

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


    
