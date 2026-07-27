const {
    SlashCommandBuilder,
    PermissionFlagsBits,
    EmbedBuilder
} = require("discord.js");

const fs = require("fs");
const path = require("path");

const bagFile = path.join(__dirname, "..", "database", "bags.json");
const itemFile = path.join(__dirname, "..", "database", "items.json");

module.exports = {

    data: new SlashCommandBuilder()

        .setName("additem")

        .setDescription("เพิ่มไอเทมเข้ากระเป๋าทีม")

        .setDefaultMemberPermissions(
            PermissionFlagsBits.Administrator
        )

        .addRoleOption(option =>
            option
                .setName("role")
                .setDescription("เลือกทีม")
                .setRequired(true)
        )

        .addStringOption(option =>
            option
                .setName("item")
                .setDescription("เลือกไอเทม")
                .setRequired(true)
                .setAutocomplete(true)
        )

        .addIntegerOption(option =>
            option
                .setName("amount")
                .setDescription("จำนวน")
                .setRequired(true)
        ),

    async autocomplete(interaction) {

        if (!fs.existsSync(itemFile))
            return interaction.respond([]);

        const items = JSON.parse(
            fs.readFileSync(itemFile, "utf8")
        );

        const focused =
            interaction.options.getFocused().toLowerCase();

        const choices = [];

        for (const id in items) {

            const item = items[id];

            choices.push({

                name:
`${item.emoji} ${item.name} (${item.slot} ช่อง)`,

                value: id

            });

        }

        const filtered = choices

            .filter(choice =>
                choice.name.toLowerCase().includes(focused)
            )

            .slice(0, 25);

        await interaction.respond(filtered);

    },

    async execute(interaction) {

        const role =
            interaction.options.getRole("role");

        const itemId =
            interaction.options.getString("item");

        const amount =
            interaction.options.getInteger("amount");

        if (!fs.existsSync(bagFile)) {

            return interaction.reply({

                content: "❌ ยังไม่มีกระเป๋าทีม",

                ephemeral: true

            });

        }

        const bags = JSON.parse(
            fs.readFileSync(bagFile, "utf8")
        );

        const items = JSON.parse(
            fs.readFileSync(itemFile, "utf8")
        );

        const bag = bags[role.id];

        if (!bag) {

            return interaction.reply({

                content: "❌ ทีมนี้ยังไม่มีกระเป๋า",

                ephemeral: true

            });

        }

        if (!items[itemId]) {

            return interaction.reply({

                content: "❌ ไม่พบไอเทม",

                ephemeral: true

            });

        }

        if (!bag.items[itemId]) {

            bag.items[itemId] = 0;

        }

        bag.items[itemId] += amount;

        fs.writeFileSync(

            bagFile,

            JSON.stringify(bags, null, 2)

        );

        const item = items[itemId];

        const embed = new EmbedBuilder()

            .setColor(role.color)

            .setDescription(
`# 📦 เพิ่มไอเทมสำเร็จ

${role}

${item.emoji} **${item.name}**

จำนวน **${amount}** ชิ้น`
            );

        await interaction.reply({

            embeds: [embed]

        });

    }

};