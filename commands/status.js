const {
    SlashCommandBuilder,
    PermissionFlagsBits
} = require("discord.js");

const fs = require("fs");

const file = "./database/players.json";


module.exports = {

data: new SlashCommandBuilder()

.setName("status")

.setDescription("ตั้งค่าสถานะผู้เล่น")

.setDefaultMemberPermissions(
    PermissionFlagsBits.Administrator
)

.addUserOption(option =>
    option
        .setName("player")
        .setDescription("เลือกผู้เล่น")
        .setRequired(true)
)

.addIntegerOption(option =>
    option
        .setName("str")
        .setDescription("ค่า STR")
        .setRequired(true)
)

.addIntegerOption(option =>
    option
        .setName("agi")
        .setDescription("ค่า AGI")
        .setRequired(true)
)

.addIntegerOption(option =>
    option
        .setName("int")
        .setDescription("ค่า INT")
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


const STR =
interaction.options.getInteger("str");


const AGI =
interaction.options.getInteger("agi");


const INT =
interaction.options.getInteger("int");


players[user.id] = {

name: user.username,

STR: STR,

AGI: AGI,

INT: INT

};


fs.writeFileSync(
file,
JSON.stringify(players,null,4)
);


await interaction.reply({

content:
`📋 **Status Update**

<@${user.id}>

STR : ${STR}
AGI : ${AGI}
INT : ${INT}`

});


}

catch(error){

console.error(error);

if(!interaction.replied){

await interaction.reply({
content:"❌ เกิดข้อผิดพลาด"
});

}

}

}

};
