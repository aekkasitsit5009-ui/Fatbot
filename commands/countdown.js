const { SlashCommandBuilder } = require("discord.js");


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


        await interaction.deferReply();


        const time = interaction.options.getInteger("time");
        const text = interaction.options.getString("text");
        const playerText = interaction.options.getString("player") || "";


        let seconds = time;


        function formatTime(sec) {


            const minute = Math.floor(sec / 60);
            const second = sec % 60;


            return `${String(minute).padStart(2, "0")}:${String(second).padStart(2, "0")}`;


        }


        const message = await interaction.editReply({


            content:
`## __${text}__


# ${formatTime(seconds)}`


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


                console.error(error);
                clearInterval(timer);


            }


        }, 1000);


    }


};

