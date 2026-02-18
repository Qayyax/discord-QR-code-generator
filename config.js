import { configDotenv } from "dotenv";
configDotenv({ quiet: true }); // This is to load .env variables using dotenv package
const config = {
  discordToken: process.env.DISCORD_TOKEN,
  clientID: process.env.CLIENT_ID,
  guildID: process.env.GUILD_ID,
};

export default config;
