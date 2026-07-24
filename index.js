require("dotenv").config();

const fs = require("node:fs");
const path = require("node:path");

const {
    Client,
    Collection,
    GatewayIntentBits,
    Events
} = require("discord.js");

const client = new Client({
    intents: [GatewayIntentBits.Guilds]
});

client.commands = new Collection();

const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith(".js"));

for (const file of commandFiles) {

    const command = require(path.join(commandsPath, file));

    client.commands.set(command.data.name, command);

}

client.once(Events.ClientReady, readyClient => {

    console.log(`✅ ${readyClient.user.tag} ออนไลน์แล้ว`);

});

client.on(Events.InteractionCreate, async interaction => {

    if (!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName);

    if (!command) return;

    try {

        await command.execute(interaction);

    } catch (error) {

        console.error(error);

        await interaction.reply({

            content: "❌ เกิดข้อผิดพลาด",

            ephemeral: true

        });

    }

});

client.login(process.env.TOKEN);