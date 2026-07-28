const {
    SlashCommandBuilder,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ComponentType
} = require("discord.js");

const fs = require("fs");
const path = require("path");


const bagFile = path.join(__dirname, "..", "database", "bags.json");
const itemFile = path.join(__dirname, "..", "database", "items.json");


module.exports = {


    data: new SlashCommandBuilder()

        .setName("bag")

        .setDescription("ดูกระเป๋าของทีม"),



    async execute(interaction) {


        if (!fs.existsSync(bagFile)) {

            return interaction.reply({
                content: "❌ ยังไม่มีกระเป๋าทีม",
                ephemeral: true
            });

        }



        const bags = JSON.parse(
            fs.readFileSync(bagFile, "utf8")
        );



        const items = fs.existsSync(itemFile)

            ? JSON.parse(fs.readFileSync(itemFile, "utf8"))

            : {};




        let bag = null;



        for (const id in bags) {


            if (interaction.member.roles.cache.has(id)) {


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





        let inventory = [];

        let usedSlot = 0;




        for (const itemId in bag.items) {


            const amount = bag.items[itemId];

            const item = items[itemId];



            if (!item) continue;



            const stackCount = Math.ceil(
                amount / item.stack
            );



            usedSlot += stackCount * item.slot;




            inventory.push({

                name: `${item.emoji} ${item.name}`,

                value:
`จำนวน: **${amount}**
📦: **${stackCount * item.slot}**`

            });



        }





        if (inventory.length === 0) {


            inventory.push({

                name: "📭 กระเป๋าว่าง",

                value: "*ยังไม่มีสิ่งของ*"

            });


        }





        const perPage = 6;


        let pages = [];



        for (
            let i = 0;
            i < inventory.length;
            i += perPage
        ) {


            pages.push(
                inventory.slice(i, i + perPage)
            );


        }




        let page = 0;




        function createEmbed() {


            const embed = new EmbedBuilder()


                .setColor(0x5865F2)


                .setTitle(`🎒 ${bag.name}`)


                .setDescription(
`📦 ช่องเก็บของ

**${usedSlot}/${bag.maxSlot}**

หน้า **${page + 1}/${pages.length}**`
                );



            embed.addFields(
                pages[page]
            );



            return embed;


        }






        function createButtons() {



            return new ActionRowBuilder()

                .addComponents(


                    new ButtonBuilder()

                        .setCustomId("bag_prev")

                        .setEmoji("◀️")

                        .setStyle(ButtonStyle.Primary)

                        .setDisabled(page === 0),




                    new ButtonBuilder()

                        .setCustomId("bag_next")

                        .setEmoji("▶️")

                        .setStyle(ButtonStyle.Primary)

                        .setDisabled(page === pages.length - 1)


                );


        }





        const message = await interaction.reply({


            embeds: [

                createEmbed()

            ],


            components: [

                createButtons()

            ],


            fetchReply: true


        });







        const collector = message.createMessageComponentCollector({


            componentType: ComponentType.Button,


            time: 300000 // 5 นาที


        });







        collector.on("collect", async i => {



            // ทุกคนกดดูได้

            if (i.customId === "bag_prev") {


                page--;


            }



            if (i.customId === "bag_next") {


                page++;


            }




            await i.update({


                embeds: [

                    createEmbed()

                ],


                components: [

                    createButtons()

                ]


            });



        });







        collector.on("end", async () => {



            await message.edit({


                components: []


            }).catch(() => {});



        });





    }

};