import { configDotenv } from "dotenv";
configDotenv({ quiet: true }); // This is to load .env variables using dotenv package
const config = {
  discordToken: process.env.DISCORD_TOKEN,
};

export default config;
