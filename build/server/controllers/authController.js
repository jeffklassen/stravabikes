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
const config_1 = __importDefault(require("../config/config"));
const stravaclient_1 = require("../clients/stravaclient");
const mongoclient_1 = require("../clients/mongoclient");
const uuid = __importStar(require("uuid"));
const authController = {
    getAuthDetails: () => {
        return Promise.resolve(config_1.default.strava.authProvider);
    },
    // checks authentication
    isAuthenticated: (sessionId) => {
        return (0, mongoclient_1.getSessionData)(sessionId);
    },
    // for initial account creation
    connectToStrava: async (authCode) => {
        console.log('connectToStrava called');
        const tokenResponse = await (0, stravaclient_1.getAuthToken)(authCode);
        const { access_token, refresh_token, expires_at } = tokenResponse;
        const athlete = await (0, stravaclient_1.getAthlete)(access_token);
        athlete._id = athlete.id;
        await (0, mongoclient_1.insertAthlete)(athlete);
        const sessionId = uuid.v4();
        await (0, mongoclient_1.mapTokenToAthlete)(athlete.id, access_token, sessionId, refresh_token, expires_at);
        return sessionId;
    },
    // gets a valid access token, refreshing if needed
    getValidAccessToken: async (sessionId) => {
        const sessionData = await (0, mongoclient_1.getSessionData)(sessionId);
        if (!sessionData) {
            return null;
        }
        // Check if token is expired and needs refresh
        if (sessionData.expiresAt && (0, stravaclient_1.isTokenExpired)(sessionData.expiresAt)) {
            if (!sessionData.refreshToken) {
                console.log('Token expired and no refresh token available');
                return null;
            }
            try {
                console.log('Token expired, refreshing...');
                const newTokenData = await (0, stravaclient_1.refreshToken)(sessionData.refreshToken);
                const { access_token, refresh_token, expires_at } = newTokenData;
                // Update session with new tokens
                await (0, mongoclient_1.updateSessionTokens)(sessionId, access_token, refresh_token, expires_at);
                console.log('Token refreshed successfully');
                return access_token;
            }
            catch (error) {
                console.log('Token refresh failed:', error);
                return null;
            }
        }
        return sessionData.accessToken;
    }
};
exports.default = authController;
//# sourceMappingURL=authController.js.map