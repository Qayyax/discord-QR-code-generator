import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import config from "./config.js";
import {
  Client,
  Collection,
  Events,
  GatewayIntentBits,
  MessageFlags,
} from "discord.js";

const { discordToken } = config;
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

client.once(Events.ClientReady, (readyClient) => {
  console.log(`Ready! Logged in  as ${readyClient.user.tag}`);
});

client.commands = new Collection();

const folderPath = path.join(__dirname, "commands");
const commandFolders = fs.readdirSync(folderPath);

for (const folder of commandFolders) {
  const commandPath = path.join(folderPath, folder);
  const commandFiles = fs
    .readdirSync(commandPath)
    .filter((file) => file.endsWith(".js"));

  for (const file of commandFiles) {
    const filePath = path.join(commandPath, file);
    const commandModule = await import(pathToFileURL(filePath).href);
    const command = commandModule.default ?? commandModule;

    if ("data" in command && "execute" in command) {
      client.commands.set(command.data.name, command);
    } else {
      console.log(
        `[WARNING] The command at ${filePath} is missing  required "data" or "execute" property.`,
      );
    }
  }
}

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;
  const command = interaction.client.commands.get(interaction.commandName);

  if (!command) {
    console.error(`No command matching  ${interaction.commandName} was found`);
    return;
  }

  try {
    await command.execute(interaction);
  } catch (error) {
    console.log(error);
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({
        content: "There was an error while executing this command!",
        flags: MessageFlags.Ephemeral,
      });
    } else {
      await interaction.reply({
        content: "There was an error while executing this command!",
        flags: MessageFlags.Ephemeral,
      });
    }
  }
});

client.login(discordToken);
