const {
    SlashCommandBuilder
} = require("discord.js");

module.exports = {

    data: new SlashCommandBuilder()

        .setName("randomrole")

        .setDescription("สุ่มผู้เล่นจากบทบาท")

        .addRoleOption(option =>
            option
                .setName("role")
                .setDescription("เลือกบทบาท")
                .setRequired(true)
        ),

    async execute(interaction) {

        const role =
            interaction.options.getRole("role");

        // โหลดสมาชิกทั้งหมดเข้า Cache
        await interaction.guild.members.fetch();

        const members =
            interaction.guild.members.cache
                .filter(member =>
                    member.roles.cache.has(role.id) &&
                    !member.user.bot
                )
                .map(member => member);

        if (members.length === 0) {

            return interaction.reply({
                content: "❌ บทบาทนี้ไม่มีผู้เล่น",
                ephemeral: true
            });

        }

        const random =
            members[Math.floor(Math.random() * members.length)];

        await interaction.reply({

            content:
`-# 🎲 Random **${role.name}** จาก ${members.length} คน
**ผู้ได้รับเลือกคือ** __${random}__`

        });

    }

};