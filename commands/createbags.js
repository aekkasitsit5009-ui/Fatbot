const {
    SlashCommandBuilder,
    PermissionFlagsBits,
    EmbedBuilder
} = require("discord.js");

const fs = require("fs");
const path = require("path");

const file = path.join(__dirname, "..", "database", "bags.json");

module.exports = {

    data: new SlashCommandBuilder()

        .setName("createbag")

        .setDescription("สร้างกระเป๋าทีม")

        .setDefaultMemberPermissions(
            PermissionFlagsBits.Administrator
        )

        .addRoleOption(option =>
            option
                .setName("role")
                .setDescription("บทบาทของทีม")
                .setRequired(true)
        )

        .addIntegerOption(option =>
            option
                .setName("slot")
                .setDescription("จำนวนช่องเก็บของ")
                .setRequired(true)
        ),

    async execute(interaction) {

        const role = interaction.options.getRole("role");
        const slot = interaction.options.getInteger("slot");

        if (!fs.existsSync(file)) {
            fs.writeFileSync(file, "{}");
        }

        const bags = JSON.parse(
            fs.readFileSync(file, "utf8")
        );

        if (bags[role.id]) {

            return interaction.reply({

                content: "❌ ทีมนี้มีกระเป๋าอยู่แล้ว",

                ephemeral: true

            });

        }

        bags[role.id] = {

            name: role.name,

            role: role.id,

            maxSlot: slot,

            items: {}

        };

        fs.writeFileSync(
            file,
            JSON.stringify(bags, null, 2)
        );

        const embed = new EmbedBuilder()

            .setColor(role.color || 0x57F287)

            .setDescription(
`# 🎒 สร้างกระเป๋าทีมสำเร็จ

**ทีม**
${role}

**ช่องเก็บของ**
${slot} ช่อง`
            );

        await interaction.reply({

            embeds: [embed]

        });

    }

};