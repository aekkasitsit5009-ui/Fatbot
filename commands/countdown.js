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

        // ตรวจสอบเวลา
        if (time <= 0) {
            return interaction.reply({
                content: "❌ เวลาต้องมากกว่า 0 วินาที",
                ephemeral: true
            });
        }

        if (time > 86400) {
            return interaction.reply({
                content: "❌ ตั้งเวลาได้สูงสุด 24 ชั่วโมง",
                ephemeral: true
            });
        }

        const channelId = interaction.channelId;

        function formatTime(sec) {
            const minute = Math.floor(sec / 60);
            const second = sec % 60;

            return `${String(minute).padStart(2, "0")}:${String(second).padStart(2, "0")}`;
        }

        // ถ้ามี Timer เดิมให้ยกเลิก
        if (timers.has(channelId)) {
            clearInterval(timers.get(channelId));
            timers.delete(channelId);
        }

        await interaction.deferReply();

        const endTime = Date.now() + (time * 1000);

        const message = await interaction.editReply({
            content:
`## __${text}__

# ${formatTime(time)}`
        });

        const timer = setInterval(async () => {

            try {

                const seconds = Math.max(
                    0,
                    Math.ceil((endTime - Date.now()) / 1000)
                );

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

            } catch (error) {

                console.error("COUNTDOWN ERROR:", error);

                clearInterval(timer);
                timers.delete(channelId);

            }

        }, 1000);

        timers.set(channelId, timer);

    }
};