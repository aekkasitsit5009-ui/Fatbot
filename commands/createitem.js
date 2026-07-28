const {
    SlashCommandBuilder,
    PermissionFlagsBits,
    EmbedBuilder
} = require("discord.js");

const fs = require("fs");
const path = require("path");

const itemFile = path.join(
    __dirname,
    "..",
    "database",
    "items.json"
);

module.exports = {

    data: new SlashCommandBuilder()

        .setName("createitem")

        .setDescription("สร้างไอเทมใหม่")

        .setDefaultMemberPermissions(
            PermissionFlagsBits.Administrator
        )

        .addStringOption(option =>
            option
                .setName("id")
                .setDescription("ID เช่น bottled_water")
                .setRequired(true)
        )

        .addStringOption(option =>
            option
                .setName("name")
                .setDescription("ชื่อไอเทม")
                .setRequired(true)
        )

        .addStringOption(option =>
            option
                .setName("emoji")
                .setDescription("อีโมจิ")
                .setRequired(true)
        )

        .addStringOption(option =>
            option
                .setName("category")
                .setDescription("หมวดหมู่")
                .setRequired(true)
        )

        .addIntegerOption(option =>
            option
                .setName("slot")
                .setDescription("ใช้กี่ช่อง")
                .setRequired(true)
        )

        .addIntegerOption(option =>
            option
                .setName("stack")
                .setDescription("ซ้อนได้สูงสุด")
                .setRequired(true)
        ),

    async execute(interaction) {

        const id =
            interaction.options
                .getString("id")
                .trim()
                .toLowerCase();

        const name =
            interaction.options
                .getString("name")
                .trim();

        const emoji =
            interaction.options
                .getString("emoji")
                .trim();

        const category =
            interaction.options
                .getString("category")
                .trim();

        const slot =
            interaction.options
                .getInteger("slot");

        const stack =
            interaction.options
                .getInteger("stack");

        if (!fs.existsSync(itemFile)) {

            fs.writeFileSync(
                itemFile,
                "{}"
            );

        }

        const items = JSON.parse(
            fs.readFileSync(
                itemFile,
                "utf8"
            )
        );

        if (items[id]) {

            return interaction.reply({

                content:
                    "❌ มี ID นี้อยู่แล้ว",

                ephemeral: true

            });

        }

        items[id] = {

            name,

            emoji,

            category,

            slot,

            stack

        };
                fs.writeFileSync(

            itemFile,

            JSON.stringify(
                items,
                null,
                2
            )

        );

        const embed = new EmbedBuilder()

            .setColor("Green")

            .setDescription(

`### 📦 สร้างไอเทมสำเร็จ

${emoji} **${name}**

**ID**
\`${id}\`

**หมวดหมู่**
${category}

**ใช้ช่อง**
${slot}

**Stack สูงสุด**
${stack}`

            );

        await interaction.reply({

            embeds: [embed]

        });

    }

};