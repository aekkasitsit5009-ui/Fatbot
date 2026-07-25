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
                .setDescription("ข้อความที่ต้องการส่ง (`...` หรือ ```...``` สำหรับข้อความแบบโค้ด)")
                .setRequired(true)
        )

        .setDefaultMemberPermissions(
            PermissionFlagsBits.ManageMessages
        ),

    async execute(interaction) {

        const text =
            interaction.options.getString("text");

        await interaction.reply({
            content: "✅ ส่งข้อความเรียบร้อย",
            ephemeral: true
        });

        await interaction.channel.send({
            content: text
        });

    }

};