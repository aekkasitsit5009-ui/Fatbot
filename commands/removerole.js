const {
    SlashCommandBuilder,
    PermissionFlagsBits,
    EmbedBuilder
} = require("discord.js");

module.exports = {

    data: new SlashCommandBuilder()

        .setName("removerole")
        .setDescription("นำผู้เล่นออกจาก Role")

        .setDefaultMemberPermissions(
            PermissionFlagsBits.Administrator
        )

        .addRoleOption(option =>
            option
                .setName("role")
                .setDescription("เลือกบทบาท")
                .setRequired(true)
        )

        .addStringOption(option =>
            option
                .setName("players")
                .setDescription("แท็กหลายคน เช่น @A @B @C")
                .setRequired(true)
        ),

    async execute(interaction) {

        const role = interaction.options.getRole("role");
        const playersText = interaction.options.getString("players");

        const ids = [...playersText.matchAll(/<@!?(\d+)>/g)].map(x => x[1]);

        if (!ids.length) {

            return interaction.reply({
                content: "❌ กรุณาแท็กผู้เล่นอย่างน้อย 1 คน",
                ephemeral: true
            });

        }

        const botMember = interaction.guild.members.me;

        if (!botMember.permissions.has(PermissionFlagsBits.ManageRoles)) {

            return interaction.reply({
                content: "❌ บอทไม่มีสิทธิ์ Manage Roles",
                ephemeral: true
            });

        }

        if (role.position >= botMember.roles.highest.position) {

            return interaction.reply({
                content: `❌ บอทไม่สามารถจัดการบทบาท **${role.name}** ได้\nกรุณาลาก Role ของบอทให้อยู่เหนือ Role นี้`,
                ephemeral: true
            });

        }

        const members = [];

        for (const id of ids) {

            try {

                const member = await interaction.guild.members.fetch(id);

                if (member.roles.highest.position >= botMember.roles.highest.position) {
                    continue;
                }

                await member.roles.remove(role);

                members.push(`<@${id}>`);

            } catch (error) {

                console.error(error);

            }

        }

        const embed = new EmbedBuilder()

            .setColor(role.color || 0x5865F2)

            .setDescription(
`## ${role}

${members.length ? members.join(" ") : "ไม่มีสมาชิกที่สามารถนำออกได้"}

ถูกนำออกจากบทบาทแล้ว ❌`
            );

        await interaction.reply({

            embeds: [embed]

        });

    }

};