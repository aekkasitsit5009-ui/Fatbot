const {
    SlashCommandBuilder,
    PermissionFlagsBits,
    EmbedBuilder
} = require("discord.js");

const fs = require("fs");
const path = require("path");


const bagFile = path.join(
    __dirname,
    "..",
    "database",
    "bags.json"
);


const itemFile = path.join(
    __dirname,
    "..",
    "database",
    "items.json"
);



const data = new SlashCommandBuilder()

    .setName("additem")

    .setDescription("เพิ่มไอเทมเข้ากระเป๋าทีม")

    .setDefaultMemberPermissions(
        PermissionFlagsBits.Administrator
    )


    .addRoleOption(option =>
        option
            .setName("role")
            .setDescription("เลือกทีม")
            .setRequired(true)
    );



// item1 - item5

for (let i = 1; i <= 5; i++) {

    data

        .addStringOption(option =>
            option
                .setName(`item${i}`)
                .setDescription(`ไอเทม ${i}`)
                .setRequired(i === 1)
                .setAutocomplete(true)
        )

        .addIntegerOption(option =>
            option
                .setName(`amount${i}`)
                .setDescription(`จำนวน ${i}`)
                .setRequired(i === 1)
        );

}



module.exports = {

    data,



    async autocomplete(interaction) {


        if (!fs.existsSync(itemFile)) {

            return interaction.respond([]);

        }



        const items = JSON.parse(
            fs.readFileSync(
                itemFile,
                "utf8"
            )
        );



        const focused =
            interaction.options
                .getFocused()
                .toLowerCase();



        const choices = [];



        for (const id in items) {

            const item = items[id];


            choices.push({

                name:
                `${item.emoji} ${item.name} (${item.slot} ช่อง)`,

                value:id

            });


        }



        await interaction.respond(

            choices

                .filter(x =>
                    x.name
                    .toLowerCase()
                    .includes(focused)
                )

                .slice(0,25)

        );


    },






    async execute(interaction) {


        const role =
            interaction.options
                .getRole("role");




        if (
            !fs.existsSync(bagFile) ||
            !fs.existsSync(itemFile)
        ) {


            return interaction.reply({

                content:
                "❌ ไม่พบฐานข้อมูล",

                ephemeral:true

            });


        }




        const bags = JSON.parse(

            fs.readFileSync(
                bagFile,
                "utf8"
            )

        );



        const items = JSON.parse(

            fs.readFileSync(
                itemFile,
                "utf8"
            )

        );





        const bag =
            bags[role.id];





        if (!bag) {


            return interaction.reply({

                content:
                "❌ ทีมนี้ยังไม่มีกระเป๋า",

                ephemeral:true

            });


        }






        // เก็บข้อมูลเดิมไว้กันพัง

        const backup =
            JSON.parse(
                JSON.stringify(
                    bag.items
                )
            );






        const added = [];






        // เพิ่มของชั่วคราว

        for (let i = 1; i <= 5; i++) {


            const itemId =
                interaction.options
                    .getString(`item${i}`);



            const amount =
                interaction.options
                    .getInteger(`amount${i}`);




            if (!itemId || !amount)
                continue;



            if (!items[itemId])
                continue;




            if (!bag.items[itemId]) {

                bag.items[itemId] = 0;

            }



            bag.items[itemId] += amount;




            added.push({

                item:
                items[itemId],

                amount

            });



        }






        if (added.length === 0) {


            return interaction.reply({

                content:
                "❌ ไม่ได้เลือกไอเทม",

                ephemeral:true

            });


        }







        // =========================
        // คำนวณช่องใหม่ทั้งหมด
        // =========================


        let usedSlot = 0;



        for (const id in bag.items) {


            const item =
                items[id];



            if (!item)
                continue;



            const amount =
                bag.items[id];



            const stack =
                Math.ceil(
                    amount / item.stack
                );



            usedSlot +=
                stack * item.slot;


        }








        // เกินช่อง ย้อนกลับ

        if (
            usedSlot > bag.maxSlot
        ) {



            bag.items = backup;



            return interaction.reply({

                content:
`❌ ช่องเก็บของไม่พอ

📦 ตอนนี้ต้องใช้ ${usedSlot}/${bag.maxSlot}

ลดจำนวนไอเทมก่อนเพิ่ม`,

                ephemeral:true

            });


        }







        // ผ่านแล้วบันทึก

        fs.writeFileSync(

            bagFile,

            JSON.stringify(
                bags,
                null,
                2
            )

        );







        const embed =
            new EmbedBuilder()

            .setColor(
                role.color || 0x2b2d31
            )

            .setDescription(

`📦 เพิ่มไอเทม: ${added.map(x =>
`${x.item.emoji} ${x.item.name} x${x.amount}`
).join(" | ")}`

            );






        await interaction.reply({

            embeds:[embed]

        });



    }


};