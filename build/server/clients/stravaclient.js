"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAthlete = getAthlete;
exports.fullStravaActivities = fullStravaActivities;
exports.getAuthToken = getAuthToken;
const request = __importStar(require("superagent"));
const config_1 = __importDefault(require("../config/config"));
const stravaAPIURL = 'https://www.strava.com/api/v3/';
async function getAuthToken(authCode) {
    const response = await request.post('https://www.strava.com/oauth/token')
        .send({
        client_id: config_1.default.strava.authProvider.clientId,
        client_secret: config_1.default.strava.clientSecret,
        scope: config_1.default.strava.authProvider.scope,
        code: authCode,
        grant_type: 'authorization_code'
    });
    console.log('getAuthToken', response.body);
    return response.body;
}
async function fullStravaActivities(authId) {
    const stravaActivityUrl = stravaAPIURL + 'activities';
    const headers = { Authorization: `Bearer ${authId}` };
    const params = { per_page: 200 };
    let stravaActivities = [];
    let morePages = true;
    let pageCounter = 1;
    while (morePages) {
        params.page = pageCounter;
        try {
            const response = await request
                .get(stravaActivityUrl)
                .query(params)
                .set(headers);
            const activities = response.body;
            stravaActivities = stravaActivities.concat(activities);
            pageCounter++;
            console.log('page returned, got', activities.length);
            if (activities.length < (params.per_page || 200)) {
                morePages = false;
            }
        }
        catch (err) {
            console.log(err);
            throw err;
        }
    }
    stravaActivities = stravaActivities.map((activity) => {
        activity._id = activity.id;
        return activity;
    });
    return stravaActivities;
}
async function getAthlete(authId) {
    const stravaAthleteUrl = stravaAPIURL + 'athlete';
    const headers = { Authorization: `Bearer ${authId}` };
    try {
        const response = await request
            .get(stravaAthleteUrl)
            .set(headers);
        console.log('RESPONSE');
        console.log(response.body);
        const athlete = response.body;
        console.log('ATHLETE RESPONSE BODY');
        console.log(athlete);
        return athlete;
    }
    catch (err) {
        throw err;
    }
}
//# sourceMappingURL=stravaclient.js.map