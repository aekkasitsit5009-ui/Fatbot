const {
    SlashCommandBuilder,
    PermissionFlagsBits,
    EmbedBuilder
} = require("discord.js");

const fs = require("fs");
const path = require("path");


const file = path.join(
    __dirname,
    "..",
    "database",
    "bags.json"
);



module.exports = {

    data: new SlashCommandBuilder()

        .setName("addslot")

        .setDescription("เพิ่มช่องกระเป๋าทีม")

        .setDefaultMemberPermissions(
            PermissionFlagsBits.Administrator
        )


        .addRoleOption(option =>

            option

                .setName("role")

                .setDescription("เลือกทีม")

                .setRequired(true)

        )


        .addIntegerOption(option =>

            option

                .setName("amount")

                .setDescription("จำนวนช่องที่เพิ่ม")

                .setRequired(true)

        ),




    async execute(interaction) {



        const role =

            interaction.options
                .getRole("role");



        const amount =

            interaction.options
                .getInteger("amount");





        if (amount <= 0) {


            return interaction.reply({

                content:
                "❌ จำนวนช่องต้องมากกว่า 0",

                ephemeral:true

            });


        }







        if (!fs.existsSync(file)) {


            return interaction.reply({

                content:
                "❌ ยังไม่มีข้อมูลกระเป๋า",

                ephemeral:true

            });


        }






        const bags = JSON.parse(

            fs.readFileSync(
                file,
                "utf8"
            )

        );







        const bag = bags[role.id];







        if (!bag) {


            return interaction.reply({

                content:
                "❌ ทีมนี้ยังไม่มีกระเป๋า",

                ephemeral:true

            });


        }








        const before =

            bag.maxSlot;





        bag.maxSlot += amount;







        fs.writeFileSync(

            file,

            JSON.stringify(
                bags,
                null,
                2
            )

        );







        const embed = new EmbedBuilder()

            .setColor(
                role.color || 0x57F287
            )


            .setDescription(

`## 🎒 เพิ่มช่องกระเป๋าสำเร็จ

**ทีม**
${role}

📦 ช่องเดิม
${before} ช่อง

➕ เพิ่ม
${amount} ช่อง

📦 ช่องใหม่
${bag.maxSlot} ช่อง`

            );







        await interaction.reply({

            embeds:[embed]

        });



    }


};