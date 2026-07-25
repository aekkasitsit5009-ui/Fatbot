const {
    SlashCommandBuilder,
    PermissionFlagsBits,
    EmbedBuilder
} = require("discord.js");

module.exports = {

    data: new SlashCommandBuilder()

        .setName("giverole")
        .setDescription("สร้าง Role และมอบให้ผู้เล่น")

        .setDefaultMemberPermissions(
            PermissionFlagsBits.Administrator
        )

        .addStringOption(option =>
            option
                .setName("role")
                .setDescription("ชื่อบทบาท")
                .setRequired(true)
        )

        .addStringOption(option =>
            option
                .setName("players")
                .setDescription("แท็กหลายคน เช่น @A @B @C")
                .setRequired(true)
        )

        .addStringOption(option =>
            option
                .setName("preset_color")
                .setDescription("เลือกสี")
                .setRequired(false)
                .addChoices(

                    { name: "Default", value: "Default" },
                    { name: "Red", value: "Red" },
                    { name: "Dark Red", value: "DarkRed" },
                    { name: "Orange", value: "Orange" },
                    { name: "Yellow", value: "Yellow" },
                    { name: "Green", value: "Green" },
                    { name: "Dark Green", value: "DarkGreen" },
                    { name: "Blue", value: "Blue" },
                    { name: "Dark Blue", value: "DarkBlue" },
                    { name: "Purple", value: "Purple" },
                    { name: "Dark Purple", value: "DarkPurple" },
                    { name: "Pink", value: "LuminousVividPink" },
                    { name: "Magenta", value: "DarkVividPink" },
                    { name: "Aqua", value: "Aqua" },
                    { name: "Dark Aqua", value: "DarkAqua" },
                    { name: "Gold", value: "Gold" },
                    { name: "Dark Gold", value: "DarkGold" },
                    { name: "Grey", value: "Grey" },
                    { name: "Dark Grey", value: "DarkGrey" },
                    { name: "Light Grey", value: "LightGrey" },
                    { name: "Navy", value: "Navy" },
                    { name: "Teal", value: "DarkButNotBlack" },
                    { name: "White", value: "White" },
                    { name: "Black", value: "NotQuiteBlack" },
                    { name: "Random", value: "Random" }

                )
        )

        .addStringOption(option =>
            option
                .setName("hex_color")
                .setDescription("เช่น #FF0000")
                .setRequired(false)
        )

        .addBooleanOption(option =>
            option
                .setName("hoist")
                .setDescription("แสดงแยกในรายชื่อสมาชิก")
                .setRequired(false)
        )

        .addBooleanOption(option =>
            option
                .setName("mentionable")
                .setDescription("ทุกคนสามารถแท็กได้")
                .setRequired(false)
        ),

    async execute(interaction) {

        const roleName = interaction.options.getString("role");
        const playersText = interaction.options.getString("players");

        const presetColor = interaction.options.getString("preset_color");
        const hexColor = interaction.options.getString("hex_color");

        const hoist =
            interaction.options.getBoolean("hoist") ?? false;

        const mentionable =
            interaction.options.getBoolean("mentionable") ?? false;

        const oldRole =
            interaction.guild.roles.cache.find(
                r => r.name.toLowerCase() === roleName.toLowerCase()
            );

        if (oldRole) {

            return interaction.reply({
                content: "❌ มีบทบาทนี้อยู่แล้ว",
                ephemeral: true
            });

        }

        const color = hexColor || presetColor || "Default";

        const role = await interaction.guild.roles.create({

            name: roleName,
            color: color,
            hoist: hoist,
            mentionable: mentionable,
            reason: `${interaction.user.tag} สร้าง Role`

        });

        const ids = [...playersText.matchAll(/<@!?(\d+)>/g)].map(
            x => x[1]
        );

        let success = 0;

        const receivedMembers = [];

        for (const id of ids) {

            try {

                const member =
                    await interaction.guild.members.fetch(id);

                await member.roles.add(role);

                success++;

                receivedMembers.push(`<@${id}>`);

            } catch (error) {

                console.error(error);

            }

        }

        const embed = new EmbedBuilder()

            .setColor(role.color)

            .setTitle("✅ สร้างบทบาทสำเร็จ")

            .addFields(

                {
                    name: "🏷️ บทบาท",
                    value: `<@&${role.id}>`,
                    inline: true
                },

                {
                    name: "👥 จำนวนสมาชิก",
                    value: `${success} คน`,
                    inline: true
                },

                {
                    name: "📋 สมาชิกที่ได้รับบทบาท",
                    value:
                        receivedMembers.length > 0
                            ? receivedMembers.join("\n")
                            : "ไม่มีสมาชิก",
                    inline: false
                }

            )

            .setFooter({
                text: `สร้างโดย ${interaction.user.tag}`
            })

            .setTimestamp();

        await interaction.reply({

            embeds: [embed]

        });

    }

};