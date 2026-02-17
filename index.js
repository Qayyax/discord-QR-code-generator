import config from "./config.js";
import { Client, Events, GatewayIntentBits } from "discord.js";

const { discordToken } = config;
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
client.once(Events.ClientReady, (readyClient) => {
  console.log(`Ready! Logged in  as ${readyClient.user.id}`);
});

client.login(discordToken);
