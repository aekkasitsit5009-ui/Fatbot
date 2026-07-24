const {
    SlashCommandBuilder
} = require("discord.js");

const figlet = require("figlet");

module.exports = {

    data: new SlashCommandBuilder()
        .setName("text")
        .setDescription("ข้อความตัวใหญ่")
        .addStringOption(option =>
            option
                .setName("message")
                .setDescription("ข้อความ")
                .setRequired(true)
        ),

    async execute(interaction) {

        const text = interaction.options.getString("message");

        figlet(text, function(err, data) {

            if (err) {

                return interaction.reply("เกิดข้อผิดพลาด");

            }

            interaction.reply({

                content: "```" + data + "```"

            });

        });

    }

};