const {
    SlashCommandBuilder,
    PermissionFlagsBits
} = require("discord.js");

module.exports = {

    data: new SlashCommandBuilder()
        .setName("addrole")
        .setDescription("เพิ่มผู้เล่นเข้า Role ที่มีอยู่แล้ว")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)

        .addRoleOption(option =>
            option
                .setName("role")
                .setDescription("เลือกบทบาท")
                .setRequired(true)
        )

        .addUserOption(option =>
            option
                .setName("player1")
                .setDescription("ผู้เล่นคนที่ 1")
                .setRequired(true)
        )

        .addUserOption(option =>
            option
                .setName("player2")
                .setDescription("ผู้เล่นคนที่ 2")
                .setRequired(false)
        )

        .addUserOption(option =>
            option
                .setName("player3")
                .setDescription("ผู้เล่นคนที่ 3")
                .setRequired(false)
        )

        .addUserOption(option =>
            option
                .setName("player4")
                .setDescription("ผู้เล่นคนที่ 4")
                .setRequired(false)
        ),

    async execute(interaction) {

        const role = interaction.options.getRole("role");

        const players = [
            interaction.options.getUser("player1"),
            interaction.options.getUser("player2"),
            interaction.options.getUser("player3"),
            interaction.options.getUser("player4")
        ].filter(Boolean);

        for (const user of players) {

            const member = await interaction.guild.members.fetch(user.id);

            await member.roles.add(role);

        }

        await interaction.reply(
            `✅ เพิ่มผู้เล่น ${players.length} คนเข้า Role **${role.name}** เรียบร้อย`
        );

    }

};