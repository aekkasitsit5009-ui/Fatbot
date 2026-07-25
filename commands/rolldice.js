const {
    SlashCommandBuilder
} = require("discord.js");

const fs = require("fs");

const file = "./database/players.json";

module.exports = {

    data: new SlashCommandBuilder()

        .setName("rolldice")

        .setDescription("ทอยลูกเต๋า")

        .addIntegerOption(option =>
            option
                .setName("amount")
                .setDescription("จำนวนครั้งที่ทอย")
                .setRequired(true)
        )

        .addIntegerOption(option =>
            option
                .setName("d")
                .setDescription("หน้าเต๋า เช่น 20")
                .setRequired(true)
        )

        .addStringOption(option =>
            option
                .setName("stat")
                .setDescription("เลือก STR INT AGI")
                .setRequired(false)
                .addChoices(
                    {
                        name: "STR",
                        value: "STR"
                    },
                    {
                        name: "INT",
                        value: "INT"
                    },
                    {
                        name: "AGI",
                        value: "AGI"
                    }
                )
        )

        .addStringOption(option =>
            option
                .setName("check")
                .setDescription("เงื่อนไขตรวจสอบ")
                .setRequired(false)
                .addChoices(
                    {
                        name: ">",
                        value: ">"
                    },
                    {
                        name: "<",
                        value: "<"
                    },
                    {
                        name: ">=",
                        value: ">="
                    },
                    {
                        name: "<=",
                        value: "<="
                    },
                    {
                        name: "=",
                        value: "="
                    }
                )
        )

        .addIntegerOption(option =>
            option
                .setName("target")
                .setDescription("ค่าที่ต้องผ่าน")
                .setRequired(false)
        ),

    async execute(interaction) {

        try {

            // อ่านข้อมูลผู้เล่น
            let players = {};

            if (fs.existsSync(file)) {

                players = JSON.parse(
                    fs.readFileSync(file, "utf8")
                );

            }

            const player = players[interaction.user.id];

            // รับค่า
            const amount =
                interaction.options.getInteger("amount");

            const dice =
                interaction.options.getInteger("d");

            const stat =
                interaction.options.getString("stat");

            const check =
                interaction.options.getString("check");

            const target =
                interaction.options.getInteger("target");

            // ตรวจสอบค่าพื้นฐาน
            if (amount <= 0 || dice <= 0) {

                return await interaction.reply({
                    content: "❌ ค่าเต๋าไม่ถูกต้อง"
                });

            }

            if (amount > 100) {

                return await interaction.reply({
                    content: "❌ ทอยได้สูงสุด 100 ลูก"
                });

            }

            if (dice > 1000) {

                return await interaction.reply({
                    content: "❌ หน้าเต๋าสูงสุดคือ 1000"
                });

            }

            // ต้องใส่ check และ target พร้อมกัน
            if (
                (check && target == null) ||
                (!check && target != null)
            ) {

                return await interaction.reply({
                    content: "❌ กรุณาระบุทั้ง check และ target พร้อมกัน"
                });

            }

            // ค่า Status
            let bonus = 0;

            if (stat) {

                if (!player) {

                    return await interaction.reply({
                        content: "❌ ยังไม่มีข้อมูล Status"
                    });

                }

                bonus = Number(player[stat]) || 0;

            }

            // ทอยเต๋า
            let rolls = [];
            let rollTotal = 0;

            for (let i = 0; i < amount; i++) {

                const roll =
                    Math.floor(Math.random() * dice) + 1;

                rolls.push(roll);

                rollTotal += roll;

            }

            // รวมโบนัส
            const total =
                rollTotal + bonus;

            // ทำตัวหนาเลข 1 และเลขสูงสุด
            const displayRolls =
                rolls.map(num => {

                    if (num === 1 || num === dice) {

                        return `**${num}**`;

                    }

                    return num;

                });

            // ตรวจสอบเป้าหมาย
            let checkResult = "";

            if (check != null && target != null) {

                let pass = false;

                switch (check) {

                    case ">":
                        pass = total > target;
                        break;

                    case "<":
                        pass = total < target;
                        break;

                    case ">=":
                        pass = total >= target;
                        break;

                    case "<=":
                        pass = total <= target;
                        break;

                    case "=":
                        pass = total === target;
                        break;

                }

                checkResult =
`━━━━━━━━━━

Target ${check} ${target}

${pass ? "✅ SUCCESS" : "❌ FAILED"}`;

            }

            // ส่งผล
            await interaction.reply({

                content:

`🎲 **${amount}d${dice}${stat ? ` + ${stat}` : ""}**

(${displayRolls.join(", ")})${stat ? ` + ${bonus}` : ""}

${rollTotal}${stat ? ` + ${bonus}` : ""}

# **${total}**${checkResult}

<@${interaction.user.id}>`

            });

        }

        catch (error) {

            console.error(
                "ROLLDICE ERROR:",
                error
            );

            if (
                !interaction.replied &&
                !interaction.deferred
            ) {

                await interaction.reply({
                    content: "❌ เกิดข้อผิดพลาดในระบบทอยเต๋า"
                });

            }

        }

    }

};