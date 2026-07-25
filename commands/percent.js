const {
    SlashCommandBuilder
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

        await interaction.reply({

            content:
`## ${text}

# ${percent}%`

        });

    }

};