import config from "./config.js";
import {
  AttachmentBuilder,
  Client,
  Events,
  GatewayIntentBits,
  REST,
  Routes,
  SlashCommandBuilder,
} from "discord.js";
import getQRCode from "./qrcode-gen.js";

const { discordToken, clientID, guildID } = config;

const client = new Client({
  intents: [GatewayIntentBits.Guilds],
});

const animes = ["Demon Slayer", "Jujutsu Kaisen", "Naruto", "My hero Academia"];

const commands = [
  new SlashCommandBuilder()
    .setName("hello")
    .setDescription("Say hello")
    .addStringOption((option) =>
      option
        .setName("name")
        .setDescription("The name to greet as default")
        .setRequired(false),
    )
    .toJSON(),

  new SlashCommandBuilder()
    .setName("anime")
    .setDescription("Responds with random Anime")
    .toJSON(),
  new SlashCommandBuilder()
    .setName("qr-generator")
    .setDescription("Returns a qr generated image based on option")
    .addStringOption((option) =>
      option
        .setName("uri")
        .setDescription("The uri you want to convert to qr-code")
        .setRequired(true),
    )
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
      const name = interaction.options.getString("name", false);
      await interaction.reply(`hello ${name ?? interaction.user.username}`);
      return;
    }

    if (interaction.commandName === "anime") {
      const randomNumber = Math.floor(Math.random() * animes.length);
      const randomAnime = animes[randomNumber];
      await interaction.reply(` You should watch ${randomAnime}`);
      return;
    }

    if (interaction.commandName === "qr-generator") {
      await interaction.deferReply();
      // this is where we call the fetch function
      const uri = interaction.options.getString("uri", true);
      try {
        const { ext, bytes } = await getQRCode(uri);
        const file = new AttachmentBuilder(Buffer.from(bytes), {
          name: `qr-code.${ext}`,
        });
        await interaction.editReply({
          content: `hello ${interaction.user.username}`,
          files: [file],
        });
      } catch (err) {
        await interaction.editReply(`Failed to fetch image: ${err.message}`);
      }
      return;
    }
  });

  await client.login(discordToken);
}

main().catch(console.error);
