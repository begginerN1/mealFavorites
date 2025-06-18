import "dotenv/config";

export const ENV = {
  PORT: process.env.PORT,
  DB_URI: process.env.DB_URI,
  MODE_ENV: process.env.MODE_ENV,
  API_URL: process.env.API_URL,
};
