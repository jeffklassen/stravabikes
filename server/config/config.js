import path from "path";

export const config = {};
config.options = {
  root: path.normalize(process.cwd() + "/client/"),
};
config.strava = {
  authProvider: {
    authUrl: "https://www.strava.com/oauth/authorize",
    clientId: process.env.NODE_ENV == "dev" ? 5893 : 5893,
    redirectUri:
      process.env.NODE_ENV == "dev"
        ? "http://localhost:3000/login"
        : "https://trackmybike.herokuapp.com/login",
    scope: "read,activity:read,profile:read_all",
  },
  clientSecret: process.env.CLIENTSECRET,
};
