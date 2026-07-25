const {
    SlashCommandBuilder
} = require("discord.js");

const fs = require("fs");

const file = "./database/players.json";

module.exports = {

    data: new SlashCommandBuilder()

        .setName("r")

        .setDescription("ทอยเต๋า")

        .addStringOption(option =>
            option
                .setName("dice")
                .setDescription("เช่น d20, 2d6, 1d20+STR")
                .setRequired(true)
        )

        .addIntegerOption(option =>
            option
                .setName("target")
                .setDescription("ค่าที่ต้องผ่าน")
                .setRequired(false)
        ),

    async execute(interaction) {

        let players = {};

        if (fs.existsSync(file)) {

            players = JSON.parse(
                fs.readFileSync(file, "utf8")
            );

        }

        const player = players[interaction.user.id];

        const input =
            interaction.options
                .getString("dice")
                .replace(/\s+/g, "")
                .toUpperCase();

        const target =
            interaction.options.getInteger("target");

        // d20 -> 1d20
        const formula =
            input.replace(/^D/, "1D");

        // 2D6+STR
        const match =
            formula.match(/^(\d+)D(\d+)(?:\+(STR|AGI|INT))?$/);

        if (!match) {

            return interaction.reply({

                content:
` รูปแบบไม่ถูกต้อง

ตัวอย่างที่ถูก

d20
2d6
1d20+STR
3d6+AGI`,

                ephemeral: true

            });

        }

        let amount =
            parseInt(match[1]);

        let dice =
            parseInt(match[2]);

        const stat =
            match[3];

        if (amount <= 0 || dice <= 0) {

            return interaction.reply({

                content: "❌ สูตรเต๋าไม่ถูกต้อง",

                ephemeral: true

            });

        }

        if (amount > 100) {

            return interaction.reply({

                content: "❌ จำกัดไม่เกิน 100 ลูก",

                ephemeral: true

            });

        }

        let bonus = 0;

        if (stat) {

            if (!player) {

                return interaction.reply({

                    content: "❌ ยังไม่มีข้อมูล Status",

                    ephemeral: true

                });

            }

            bonus =
                player[stat] || 0;

        }

        let rolls = [];

        let rollTotal = 0;

        for (let i = 0; i < amount; i++) {

            const roll =
                Math.floor(
                    Math.random() * dice
                ) + 1;

            rolls.push(roll);

            rollTotal += roll;

        }
                let total =
            rollTotal + bonus;

        // ทำตัวหนาเลข 1 และเลขสูงสุด
        const displayRolls =
            rolls.map(num => {

                if (num === 1 || num === dice) {

                    return `**${num}**`;

                }

                return `${num}`;

            });

        let resultText = "";

        if (target !== null) {

            if (total >= target) {

                resultText =
`__ Target : ${target}__

✅ **SUCCESS**`;

            } else {

                resultText =
`__ Target : ${target}__

❌ **FAILED**`;

            }

        }

        let title =
            `${amount}d${dice}`;

        if (stat) {

            title += ` + ${stat}`;

        }

        let description =

`🎲 **${title}**

(${displayRolls.join(", ")})`;
        if (stat) {

            description += ` + **${bonus}**`;

        }

        description +=

`

# **${total}**`;

        if (resultText) {

            description +=

`

${resultText}`;

        }

        await interaction.reply({

            content: description

        });

    }

};