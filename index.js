import config from "./config.js";
import {
  Client,
  Events,
  GatewayIntentBits,
  REST,
  Routes,
  SlashCommandBuilder,
} from "discord.js";

const { discordToken, clientID, guildID } = config;

const client = new Client({
  intents: [GatewayIntentBits.Guilds],
});

const animes = ["Demon Slayer", "Jujutsu Kaisen", "Naruto", "My hero Academia"];

const commands = [
  new SlashCommandBuilder()
    .setName("hello")
    .setDescription("Say hello")
    .toJSON(),

  new SlashCommandBuilder()
    .setName("anime")
    .setDescription("Responds with random Anime")
    .toJSON(),
];

async function main() {
  const rest = new REST({ version: "10" }).setToken(discordToken);

  await rest.put(Routes.applicationGuildCommands(clientID, guildID), {
    body: commands,
  });

  client.once(Events.ClientReady, (c) => {
    console.log(`Logged in as ${c.user.tag}`);
  });

  client.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isChatInputCommand()) return;
    if (interaction.commandName === "hello") {
      await interaction.reply(`hello ${interaction.user.username}`);
    }
    if (interaction.commandName === "anime") {
      const randomNumber = Math.floor(Math.random() * animes.length);
      const randomAnime = animes[randomNumber];
      await interaction.reply(` You should watch ${randomAnime}`);
    }
  });

  await client.login(discordToken);
}

main().catch(console.error);
