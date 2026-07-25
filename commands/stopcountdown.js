const {
    SlashCommandBuilder
} = require("discord.js");

const timers = require("../timerManager");

module.exports = {

data: new SlashCommandBuilder()

.setName("stopcountdown")

.setDescription("หยุดตัวจับเวลาของห้องนี้"),

async execute(interaction){

const channelId = interaction.channel.id;

if(!timers.has(channelId)){

return interaction.reply({

content:"❌ ไม่มีตัวจับเวลาที่กำลังทำงาน",

ephemeral:true

});

}

clearInterval(timers.get(channelId));

timers.delete(channelId);

await interaction.reply({

content:"# 👁หยุดจับเวลาแล้ว"

});

}

};
