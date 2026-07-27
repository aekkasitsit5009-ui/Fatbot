const {
    SlashCommandBuilder,
    EmbedBuilder
} = require("discord.js");

const fs = require("fs");
const path = require("path");

const bagFile = path.join(__dirname, "..", "database", "bags.json");
const itemFile = path.join(__dirname, "..", "database", "items.json");

module.exports = {

    data: new SlashCommandBuilder()

        .setName("bag")

        .setDescription("ดูกระเป๋าของทีม"),

    async execute(interaction) {

        if (!fs.existsSync(bagFile)) {

            return interaction.reply({
                content: "❌ ยังไม่มีกระเป๋าทีม",
                ephemeral: true
            });

        }

        const bags = JSON.parse(
            fs.readFileSync(bagFile, "utf8")
        );

        const items = fs.existsSync(itemFile)
            ? JSON.parse(fs.readFileSync(itemFile, "utf8"))
            : {};

        let bag = null;

        for (const id in bags) {

            if (interaction.member.roles.cache.has(id)) {

                bag = bags[id];
                break;

            }

        }

        if (!bag) {

            return interaction.reply({
                content: "❌ คุณไม่มีกระเป๋าทีม",
                ephemeral: true
            });

        }

        let usedSlot = 0;
        let text = "";

        for (const itemId in bag.items) {

            const amount = bag.items[itemId];

            const item = items[itemId];

            if (!item) continue;

            usedSlot += item.slot * amount;

            text += `${item.emoji} ${item.name} ×${amount}\n`;

        }

        if (text === "") {

            text = "*ยังไม่มีสิ่งของ*";

        }

        const embed = new EmbedBuilder()

            .setColor(0x5865F2)

            .setDescription(
`# 🎒 ${bag.name}

**ช่องเก็บของ**
${usedSlot}/${bag.maxSlot}

${text}`
            );

        await interaction.reply({

            embeds: [embed]

        });

    }

};