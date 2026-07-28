const {
    SlashCommandBuilder,
    EmbedBuilder
} = require("discord.js");

const fs = require("fs");
const path = require("path");

const bagFile = path.join(__dirname, "..", "database", "bags.json");
const itemFile = path.join(__dirname, "..", "database", "items.json");

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

        if (!fs.existsSync(itemFile))
            return interaction.respond([]);

        const items = JSON.parse(
            fs.readFileSync(itemFile, "utf8")
        );

        const focused =
            interaction.options.getFocused(true);

        if (focused.name === "category") {

            const categories = [
                ...new Set(
                    Object.values(items).map(i => i.category)
                )
            ];

            return interaction.respond(

                categories

                    .filter(c =>
                        c.toLowerCase().includes(
                            focused.value.toLowerCase()
                        )
                    )

                    .slice(0, 25)

                    .map(c => ({

                        name: c,

                        value: c

                    }))

            );

        }

        if (focused.name === "item") {

            const category =
                interaction.options.getString("category");

            const choices = [];

            for (const id in items) {

                const item = items[id];

                if (item.category !== category)
                    continue;

                choices.push({

                    name: `${item.emoji} ${item.name}`,

                    value: id

                });

            }

            return interaction.respond(

                choices

                    .filter(c =>
                        c.name.toLowerCase().includes(
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
            interaction.options.getString("reason") ||
            "ไม่ได้ระบุ";

        const bags = JSON.parse(
            fs.readFileSync(bagFile, "utf8")
        );

        const items = JSON.parse(
            fs.readFileSync(itemFile, "utf8")
        );

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

        if (!bag.items[itemId]) {

            return interaction.reply({
                content: "❌ ไม่มีไอเทมนี้",
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

        // จำนวนก่อนใช้
        const before =
            bag.items[itemId];

        // หักไอเทม
        bag.items[itemId] -= amount;


        // ถ้าเหลือ 0 ลบออกจากกระเป๋า
        if (bag.items[itemId] <= 0) {

            delete bag.items[itemId];

        }


        // จำนวนหลังใช้
        const after =
            bag.items[itemId] || 0;


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
`### 🎒 ใช้ไอเทม

${item.emoji} **${item.name}**

> ใช้ไป **${amount} ชิ้น**
> คงเหลือ **${after}/${item.stack}**

📝 เหตุผล
${reason}

👤 ผู้ใช้
${interaction.user}`
            );


        await interaction.reply({

            embeds: [embed]

        });

    }

};