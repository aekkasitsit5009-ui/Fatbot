const { SlashCommandBuilder } = require("discord.js");
const timers = require("../timerManager");


module.exports = {
    data: new SlashCommandBuilder()
        .setName("countdown")
        .setDescription("สร้างเวลานับถอยหลัง")
        .addIntegerOption(option =>
            option
                .setName("time")
                .setDescription("เวลาเป็นวินาที")
                .setRequired(true)
        )
        .addStringOption(option =>
            option
                .setName("text")
                .setDescription("ข้อความที่ต้องการ")
                .setRequired(true)
        )
        .addStringOption(option =>
            option
                .setName("player")
                .setDescription("แท็กผู้เล่นหลายคน")
                .setRequired(false)
        ),


    async execute(interaction) {


        const time = interaction.options.getInteger("time");
        const text = interaction.options.getString("text");
        const playerText = interaction.options.getString("player") || "";


        let seconds = time;
        const channelId = interaction.channel.id;


        function formatTime(sec) {
            const minute = Math.floor(sec / 60);
            const second = sec % 60;
            return `${String(minute).padStart(2, "0")}:${String(second).padStart(2, "0")}`;
        }


        if (timers.has(channelId)) {
            clearInterval(timers.get(channelId));
            timers.delete(channelId);
        }


        const message = await interaction.reply({
            content:
`## __${text}__


# ${formatTime(seconds)}`,
            fetchReply: true
        });


        const timer = setInterval(async () => {


            try {


                seconds--;


                if (seconds > 0) {


                    await message.edit({
                        content:
`## __${text}__


# ${formatTime(seconds)}`
                    });


                    return;
                }


                clearInterval(timer);
                timers.delete(channelId);


                await message.edit({
                    content:
`## __${text}__


# **00:00**`
                });


                if (playerText.trim()) {


                    await interaction.channel.send({
                        content:
`# หมดเวลา! ⌛️


${playerText}`
                    });


                } else {


                    await interaction.channel.send({
                        content: "# หมดเวลา! ⌛️"
                    });


                }


            } catch (err) {


                console.error(err);
                clearInterval(timer);
                timers.delete(channelId);


            }


        }, 1000);


        timers.set(channelId, timer);


    }
};

