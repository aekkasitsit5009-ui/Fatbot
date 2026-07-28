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

                .filter(choice =>

                    choice.name
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





        if (!fs.existsSync(bagFile)) {


            return interaction.reply({

                content:
                "❌ ยังไม่มีกระเป๋าทีม",

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





        const bag = bags[role.id];





        if (!bag) {


            return interaction.reply({

                content:
                "❌ ทีมนี้ยังไม่มีกระเป๋า",

                ephemeral:true

            });


        }








        // =========================
        // คำนวณช่องปัจจุบัน
        // =========================


        let currentSlot = 0;



        for (const itemId in bag.items) {


            const amount =
                bag.items[itemId];


            const item =
                items[itemId];



            if (!item)
                continue;




            const stackCount =
                Math.ceil(
                    amount / item.stack
                );



            currentSlot +=
                stackCount * item.slot;


        }








        // =========================
        // คำนวณช่องที่จะเพิ่ม
        // =========================


        let addSlot = 0;



        for (let i = 1; i <= 5; i++) {


            const itemId =

                interaction.options
                    .getString(`item${i}`);



            const amount =

                interaction.options
                    .getInteger(`amount${i}`);





            if (!itemId || !amount)
                continue;



            const item =
                items[itemId];



            if (!item)
                continue;



            const before =
                bag.items[itemId] || 0;



            const after =
                before + amount;




            const beforeStack =
                Math.ceil(
                    before / item.stack
                );



            const afterStack =
                Math.ceil(
                    after / item.stack
                );



            const extraStack =
                afterStack - beforeStack;



            addSlot +=
                extraStack * item.slot;



        }







        if (
            currentSlot + addSlot > bag.maxSlot
        ) {


            return interaction.reply({

                content:
`❌ ช่องเก็บของไม่พอ

📦 ปัจจุบัน ${currentSlot}/${bag.maxSlot}

➕ ต้องการเพิ่ม ${addSlot} ช่อง

เหลือ ${bag.maxSlot - currentSlot} ช่อง`,

                ephemeral:true

            });


        }








        // =========================
        // เพิ่มของ
        // =========================


        const added = [];




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







        fs.writeFileSync(

            bagFile,

            JSON.stringify(
                bags,
                null,
                2
            )

        );








        const embed = new EmbedBuilder()


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