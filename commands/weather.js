const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("weather")
        .setDescription("สุ่มสภาพอากาศประจำวัน")
        .addStringOption(option =>
            option
                .setName("city")
                .setDescription("ชื่อเมือง")
                .setRequired(true)
        ),

    async execute(interaction) {

        const city = interaction.options.getString("city");

        const weathers = [

            {
                emoji: "☀️",
                name: "ฟ้าโปร่ง",
                temp: "18°C",
                wind: "14 km/h",
                rain: "10%",
                effect:
`👁️ ระยะการมองเห็น +20%
🎯 การกระทำที่ต้องอาศัยการมองเห็น +1
⚡ ใช้พลังงานในการเดิน -5%`
            },

            {
                emoji: "🌧️",
                name: "ฝนตก",
                temp: "15°C",
                wind: "18 km/h",
                rain: "75%",
                effect:
`👣 ความเร็วเคลื่อนที่ -10%
👂 เสียงการเคลื่อนไหวเบาลง
🎯 การกระทำระยะไกล -1`
            },

            {
                emoji: "⛈️",
                name: "พายุฝน",
                temp: "13°C",
                wind: "36 km/h",
                rain: "95%",
                effect:
`🏃 ความเร็วเคลื่อนที่ -20%
🎯 การกระทำระยะไกล -2
⚡ ใช้พลังงาน +15%
👂 การสื่อสารทำได้ยากขึ้น`
            },

            {
                emoji: "🌫️",
                name: "หมอกหนา",
                temp: "11°C",
                wind: "7 km/h",
                rain: "15%",
                effect:
`👁️ ระยะการมองเห็น -50%
🧭 การสังเกตสิ่งรอบตัวทำได้ยากขึ้น
🎯 การกระทำระยะไกล -2`
            },

            {
                emoji: "❄️",
                name: "หิมะตก",
                temp: "-3°C",
                wind: "16 km/h",
                rain: "0%",
                effect:
`🏃 ความเร็วเคลื่อนที่ -15%
⚡ ใช้พลังงาน +10%
👣 ทิ้งรอยเท้าบนพื้นหิมะ`
            },

            {
                emoji: "🌨️",
                name: "พายุหิมะ",
                temp: "-8°C",
                wind: "40 km/h",
                rain: "0%",
                effect:
`👁️ ระยะการมองเห็นเหลือ 10 เมตร
🏃 ความเร็วเคลื่อนที่ -35%
⚡ ใช้พลังงาน +25%
📡 การสื่อสารระยะไกลไม่เสถียร`
            },

            {
                emoji: "🌪️",
                name: "ลมแรง",
                temp: "16°C",
                wind: "48 km/h",
                rain: "5%",
                effect:
`🎯 การกระทำระยะไกล -2
🌳 มีโอกาสเกิดเศษกิ่งไม้ปลิว
👂 การฟังเสียงรอบตัวลดลง`
            },

            {
                emoji: "🔥",
                name: "คลื่นความร้อน",
                temp: "31°C",
                wind: "9 km/h",
                rain: "0%",
                effect:
`⚡ ใช้พลังงาน +20
🥤 ต้องใช้น้ำเพิ่ม
🏃 การวิ่งต่อเนื่องทำได้ไม่นาน`
            },

            {
                emoji: "🧊",
                name: "หนาวจัด",
                temp: "-18°C",
                wind: "19 km/h",
                rain: "0%",
                effect:
`⚡ พลังงานลดลงเร็วขึ้น
🖐️ การใช้อุปกรณ์ช้าลง
🏃 ความเร็วเคลื่อนที่ -10%`
            },

            {
                emoji: "🌩️",
                name: "ฟ้าคะนอง",
                temp: "17°C",
                wind: "23 km/h",
                rain: "60%",
                effect:
`📡 อุปกรณ์อิเล็กทรอนิกส์อาจขัดข้อง
👂 การได้ยินเสียงรอบตัวลดลง`
            },

            {
                emoji: "🌬️",
                name: "ลมอ่อน",
                temp: "20°C",
                wind: "8 km/h",
                rain: "5%",
                effect:
`ไม่มีผลกระทบพิเศษ`
            },

            {
                emoji: "🌈",
                name: "หลังฝนตก",
                temp: "19°C",
                wind: "10 km/h",
                rain: "20%",
                effect:
`⚡ ฟื้นฟูพลังงาน +10
😊 ขวัญกำลังใจ +1`
            },

            {
                emoji: "🌙",
                name: "พระจันทร์เต็มดวง",
                temp: "10°C",
                wind: "6 km/h",
                rain: "0%",
                effect:
`👁️ ระยะการมองเห็นในเวลากลางคืน +30%
🎯 การสังเกตสิ่งรอบตัว +1`
            },

            {
                emoji: "🌑",
                name: "คืนมืดสนิท",
                temp: "8°C",
                wind: "4 km/h",
                rain: "0%",
                effect:
`👁️ ระยะการมองเห็น -70%
🔦 การมีแหล่งกำเนิดแสงช่วยลดผลกระทบ`
            },

            {
                emoji: "🌫️",
                name: "ฝุ่นควันหนาแน่น",
                temp: "22°C",
                wind: "11 km/h",
                rain: "0%",
                effect:
`😷 หากไม่มีอุปกรณ์ป้องกัน
⚡ ใช้พลังงาน +10
👁️ ระยะการมองเห็น -20%`
            }

        ];

        const weather = weathers[Math.floor(Math.random() * weathers.length)];

        const embed = new EmbedBuilder()
            .setColor("#87CEEB")
            .setTitle(`${weather.emoji} Weather to day`)
            .setDescription(`🕒 **วันนี้**\n\n📍 **${city}**`)
            .addFields(
                {
                    name: "สภาพอากาศ",
                    value:
`${weather.emoji} **${weather.name}**

🌡️ ${weather.temp}
💨 ลม ${weather.wind}
🌧️ โอกาสฝน ${weather.rain}`
                },
                {
                    name: "🎮 ผลต่อการเล่น",
                    value: weather.effect
                }
            )
            .setFooter({
                text: "FatBot Weather System"
            });

        await interaction.reply({
            embeds: [embed]
        });

    }
};
