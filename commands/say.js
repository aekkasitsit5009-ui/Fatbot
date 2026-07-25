const {
    SlashCommandBuilder,
    PermissionFlagsBits
} = require("discord.js");

module.exports = {

    data: new SlashCommandBuilder()

        .setName("say")
        .setDescription("ให้บอทส่งข้อความแทน")

        .addStringOption(option =>
            option
                .setName("text")
                .setDescription("ข้อความที่ต้องการส่ง")
                .setRequired(true)
        )

        .addBooleanOption(option =>
            option
                .setName("code")
                .setDescription("ส่งเป็นข้อความแบบโค้ด")
                .setRequired(false)
        )

        .setDefaultMemberPermissions(
            PermissionFlagsBits.ManageMessages
        ),

    async execute(interaction) {

        const text = interaction.options.getString("text");
        const code = interaction.options.getBoolean("code") ?? false;

        const content = code
            ? `\`\`\`\n${text}\n\`\`\``
            : text;

        await interaction.reply({
            content: "✅ ส่งข้อความเรียบร้อย",
            ephemeral: true
        });

        await interaction.channel.send({
            content
        });

    }

};