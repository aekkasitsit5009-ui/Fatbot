const {
    SlashCommandBuilder
} = require("discord.js");

const fs = require("fs");

const file = "./database/players.json";


module.exports = {

data: new SlashCommandBuilder()

.setName("checkstatus")

.setDescription("ดูสถานะผู้เล่น")

.addUserOption(option =>
    option
        .setName("player")
        .setDescription("เลือกผู้เล่น")
        .setRequired(true)
),


async execute(interaction){

try{

let players = {};

if(fs.existsSync(file)){

players = JSON.parse(
fs.readFileSync(file,"utf8")
);

}


const user =
interaction.options.getUser("player");


const player =
players[user.id];


if(!player){

return interaction.reply(
"ใส่ชื่อใครอ่ะอ้วน"
);

}


await interaction.reply({

content:
`**<@${user.id}>
STR : ${player.STR}
INT : ${player.INT}
AGI : ${player.AGI}**`

});


}

catch(error){

console.error(error);


if(!interaction.replied){

await interaction.reply(
"ผิดนะค้าบเช็คใหม่ดิ"
);

}

}

}

};
