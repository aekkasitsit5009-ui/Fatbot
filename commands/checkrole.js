const {
    SlashCommandBuilder,
    EmbedBuilder
} = require("discord.js");

const fs = require("fs");

const file = "./database/players.json";

module.exports = {

    data: new SlashCommandBuilder()

        .setName("checkrole")

        .setDescription("ดูสมาชิกทั้งหมดในบทบาทพร้อม Status")

        .addRoleOption(option =>
            option
                .setName("role")
                .setDescription("เลือกบทบาท")
                .setRequired(true)
        ),

    async execute(interaction) {

        let players = {};

        if (fs.existsSync(file)) {

            players = JSON.parse(
                fs.readFileSync(file, "utf8")
            );

        }

        const role = interaction.options.getRole("role");

        let members = [...role.members.values()];

        if (members.length === 0) {

            return interaction.reply({
                content: "❌ ไม่มีสมาชิกในบทบาทนี้"
            });

        }

        // เรียงตามตัวเลขที่อยู่ในชื่อเล่น
        members.sort((a, b) => {

            const numA = parseInt(a.displayName.match(/\d+/)?.[0] || "999999");
            const numB = parseInt(b.displayName.match(/\d+/)?.[0] || "999999");

            if (numA !== numB) return numA - numB;

            return a.displayName.localeCompare(
                b.displayName,
                "th",
                {
                    sensitivity: "base"
                }
            );

        });

        const embed = new EmbedBuilder()

            .setColor(role.color || 0x5865F2)

            .setTitle(`📋 ${role.name}`);

        let text = "";
        let page = 1;
        let count = 0;

        for (const member of members) {

            const data = players[member.id] || {
                STR: 0,
                INT: 0,
                AGI: 0
            };

            text +=
`**${member.displayName}**
🟥 STR ${data.STR} │ 🟦 INT ${data.INT} │ 🟩 AGI ${data.AGI}

`;

            count++;

            // 5 คนต่อ 1 Field
            if (count === 5) {

                embed.addFields({
                    name: `สมาชิก ${page}`,
                    value: text
                });

                page++;
                count = 0;
                text = "";

            }

        }

        if (text.length > 0) {

            embed.addFields({
                name: `สมาชิก ${page}`,
                value: text
            });

        }

        embed.setFooter({
            text: `สมาชิกทั้งหมด ${members.length} คน`
        });

        await interaction.reply({
            embeds: [embed]
        });

    }

};