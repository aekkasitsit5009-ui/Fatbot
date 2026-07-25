const {
    SlashCommandBuilder,
    PermissionFlagsBits,
    EmbedBuilder
} = require("discord.js");

module.exports = {

    data: new SlashCommandBuilder()

        .setName("addrole")
        .setDescription("เพิ่มผู้เล่นเข้า Role ที่มีอยู่แล้ว")

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
                content: `❌ บอทไม่สามารถเพิ่มบทบาท **${role.name}** ได้\n\nกรุณาลาก Role ของบอทให้อยู่เหนือ Role นี้ใน Server Settings → Roles`,
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

                await member.roles.add(role);

                members.push(`<@${id}>`);

            } catch (error) {

                console.error(error);

            }

        }

        const embed = new EmbedBuilder()

            .setColor(role.color || 0x5865F2)

            .setDescription(
`## ${role}

${members.length ? members.join(" ") : "ไม่มีสมาชิกที่สามารถเพิ่มบทบาทได้"}

ได้รับบทบาทแล้ว ✅`
            );

        await interaction.reply({

            embeds: [embed]

        });

    }

};