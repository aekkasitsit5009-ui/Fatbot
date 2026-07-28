const {
    SlashCommandBuilder,
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



module.exports = {


    data: new SlashCommandBuilder()

        .setName("useitem")

        .setDescription("ใช้ไอเทมจากกระเป๋าทีม")


        .addStringOption(option =>
            option
                .setName("category")
                .setDescription("หมวดหมู่")
                .setRequired(true)
                .setAutocomplete(true)
        )


        .addStringOption(option =>
            option
                .setName("item")
                .setDescription("ไอเทม")
                .setRequired(true)
                .setAutocomplete(true)
        )


        .addIntegerOption(option =>
            option
                .setName("amount")
                .setDescription("จำนวน")
                .setRequired(true)
        )


        .addStringOption(option =>
            option
                .setName("reason")
                .setDescription("เหตุผลในการใช้")
                .setRequired(false)
        ),






    async autocomplete(interaction) {


        if (
            !fs.existsSync(itemFile) ||
            !fs.existsSync(bagFile)
        ) {

            return interaction.respond([]);

        }



        const items = JSON.parse(
            fs.readFileSync(itemFile, "utf8")
        );


        const bags = JSON.parse(
            fs.readFileSync(bagFile, "utf8")
        );



        let bag = null;



        for (const id in bags) {


            if (
                interaction.member.roles.cache.has(id)
            ) {

                bag = bags[id];

                break;

            }

        }



        if (!bag) {

            return interaction.respond([]);

        }



        const focused =
            interaction.options.getFocused(true);





        // เลือกหมวดหมู่จากของที่มี

        if (focused.name === "category") {


            const categories = [

                ...new Set(

                    Object.keys(bag.items)

                        .map(id =>
                            items[id]?.category
                        )

                        .filter(Boolean)

                )

            ];



            return interaction.respond(

                categories

                    .filter(category =>
                        category
                            .toLowerCase()
                            .includes(
                                focused.value.toLowerCase()
                            )
                    )

                    .slice(0, 25)

                    .map(category => ({

                        name: `📂 ${category}`,

                        value: category

                    }))

            );


        }







        // เลือกไอเท็มจากของที่มี

        if (focused.name === "item") {


            const category =
                interaction.options.getString("category");



            const choices = [];



            for (const id in bag.items) {


                const item = items[id];


                if (!item)
                    continue;



                if (item.category !== category)
                    continue;



                choices.push({

                    name:
                    `${item.emoji} ${item.name} x${bag.items[id]}`,

                    value: id

                });


            }



            return interaction.respond(

                choices

                    .filter(choice =>
                        choice.name
                            .toLowerCase()
                            .includes(
                                focused.value.toLowerCase()
                            )
                    )

                    .slice(0, 25)

            );


        }


    },








    async execute(interaction) {


        const itemId =
            interaction.options.getString("item");


        const amount =
            interaction.options.getInteger("amount");


        const reason =
            interaction.options.getString("reason")
            ||
            "ไม่ได้ระบุ";





        const bags = JSON.parse(
            fs.readFileSync(bagFile, "utf8")
        );


        const items = JSON.parse(
            fs.readFileSync(itemFile, "utf8")
        );





        let bag = null;



        for (const id in bags) {


            if (
                interaction.member.roles.cache.has(id)
            ) {

                bag = bags[id];

                break;

            }

        }




        if (!bag) {


            return interaction.reply({

                content: "❌ คุณไม่มีกระเป๋าทีม",

                ephemeral: true

            });


        }





        if (!bag.items[itemId]) {


            return interaction.reply({

                content: "❌ ไม่มีไอเทมนี้ในกระเป๋า",

                ephemeral: true

            });


        }





        if (bag.items[itemId] < amount) {


            return interaction.reply({

                content: "❌ จำนวนไอเทมไม่พอ",

                ephemeral: true

            });


        }





        const item = items[itemId];





        bag.items[itemId] -= amount;




        if (bag.items[itemId] <= 0) {


            delete bag.items[itemId];


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


            .setColor(0xFEE75C)


            .setDescription(

`🎒 ใช้ไอเทม: ${item.emoji} ${item.name} x${amount} | ${reason}`

            );






        await interaction.reply({

            embeds: [embed]

        });



    }


};