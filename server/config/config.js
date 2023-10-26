import { fileURLToPath } from "url";
import path from "path";
const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);
export const config = {};
config.options = {
  root: path.normalize(__dirname + "/../../client/"),
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
