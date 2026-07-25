require("dotenv").config();

const fs = require("node:fs");
const path = require("node:path");

const {
    REST,
    Routes
} = require("discord.js");

const commands = [];

const commandsPath = path.join(__dirname, "commands");

const commandFiles = fs
    .readdirSync(commandsPath)
    .filter(file => file.endsWith(".js"));

for (const file of commandFiles) {

    const command = require(path.join(commandsPath, file));

    if ("data" in command && "execute" in command) {

        commands.push(command.data.toJSON());

    } else {

        console.log(`⚠️ ${file} ไม่มี data หรือ execute`);

    }

}

const rest = new REST({
    version: "10"
}).setToken(process.env.TOKEN);

(async () => {

    try {

        console.log(`🚀 กำลังลงทะเบียน ${commands.length} คำสั่ง...`);

        await rest.put(

            Routes.applicationCommands(
                process.env.CLIENT_ID
            ),

            {
                body: commands
            }

        );

        console.log("✅ ลงทะเบียน Slash Commands สำเร็จ");

    } catch (error) {

        console.error("❌ Deploy Commands Error");
        console.error(error);

    }

})();