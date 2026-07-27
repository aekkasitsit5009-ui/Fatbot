require("dotenv").config();

const http = require("http");
const fs = require("node:fs");
const path = require("node:path");

const {
    Client,
    Collection,
    GatewayIntentBits,
    Events
} = require("discord.js");

const PORT = process.env.PORT || 3000;

http.createServer((req, res) => {
    res.writeHead(200, {
        "Content-Type": "text/plain"
    });
    res.end("Bot is running");
}).listen(PORT, () => {
    console.log(`🌐 Server running on port ${PORT}`);
});

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers
    ]
});

client.commands = new Collection();

const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs
    .readdirSync(commandsPath)
    .filter(file => file.endsWith(".js"));

for (const file of commandFiles) {

    const command = require(path.join(commandsPath, file));

    if ("data" in command && "execute" in command) {

        client.commands.set(command.data.name, command);

    } else {

        console.log(`⚠️ ${file} ไม่มี data หรือ execute`);

    }

}

client.once(Events.ClientReady, client => {

    console.log(`✅ ${client.user.tag} ออนไลน์แล้ว`);

});

client.on(Events.InteractionCreate, async interaction => {

    // ===== Autocomplete =====
    if (interaction.isAutocomplete()) {

        const command = client.commands.get(interaction.commandName);

        if (!command || !command.autocomplete) return;

        try {

            await command.autocomplete(interaction);

        } catch (error) {

            console.error("========== Autocomplete Error ==========");
            console.error(error);

        }

        return;

    }

    // ===== Slash Command =====
    if (!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName);

    if (!command) return;

    try {

        await command.execute(interaction);

    } catch (error) {

        console.error(`❌ Error ในคำสั่ง /${interaction.commandName}`);
        console.error(error);

        if (error.code === 10062) return;

        try {

            if (interaction.replied || interaction.deferred) {

                await interaction.followUp({
                    content: "❌ เกิดข้อผิดพลาดระหว่างรันคำสั่ง",
                    flags: 64
                });

            } else {

                await interaction.reply({
                    content: "❌ เกิดข้อผิดพลาดระหว่างรันคำสั่ง",
                    flags: 64
                });

            }

        } catch (err) {

            if (err.code !== 40060) {

                console.error("❌ Reply Error");
                console.error(err);

            }

        }

    }

});

process.on("unhandledRejection", reason => {

    if (
        reason?.code === 10062 ||
        reason?.code === 40060
    ) return;

    console.error("========== Unhandled Rejection ==========");
    console.error(reason);

});

process.on("uncaughtException", err => {

    console.error("========== Uncaught Exception ==========");
    console.error(err);

});

client.on("error", error => {

    console.error("========== Client Error ==========");
    console.error(error);

});

client.login(process.env.TOKEN);