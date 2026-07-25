const {
    SlashCommandBuilder,
    EmbedBuilder
} = require("discord.js");

module.exports = {

    data: new SlashCommandBuilder()

        .setName("percent")

        .setDescription("สุ่มเปอร์เซ็น")

        .addStringOption(option =>
            option
                .setName("text")
                .setDescription("ข้อความที่ต้องการสุ่มเปอร์เซ็น")
                .setRequired(true)
        ),

    async execute(interaction) {

        const text =
            interaction.options.getString("text");

        const percent =
            Math.floor(Math.random() * 101);

        const embed = new EmbedBuilder()

            .setColor(0x3498db)

            .setDescription(
`## ${text}

# **${percent}%**`
            );

        await interaction.reply({

            embeds: [embed]

        });

    }

};