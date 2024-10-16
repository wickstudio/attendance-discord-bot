"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const config_json_1 = __importDefault(require("../config.json"));
module.exports = {
    name: 'show',
    data: new discord_js_1.SlashCommandBuilder()
        .setName('show')
        .setDescription('عرض المستخدمين الذين قاموا بتسجيل الدخول في قسم محدد')
        .addStringOption((option) => option
        .setName('type')
        .setDescription('اختر القسم لعرض المستخدمين المسجلين دخوله')
        .setRequired(true)
        .addChoices(...config_json_1.default.options.map((opt) => ({ name: opt.name, value: opt.name })))),
    execute(client, interaction) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const guildId = interaction.guild.id;
            const selectedType = (_a = interaction.options.get('type')) === null || _a === void 0 ? void 0 : _a.value; // 'type' is required
            if (!selectedType) {
                yield interaction.reply({ content: 'لم يتم اختيار قسم.', ephemeral: true });
                return;
            }
            try {
                const allEntries = yield client.db.all();
                const loggedInEntries = allEntries.filter((entry) => entry.id.startsWith(`${guildId},`) &&
                    entry.id.endsWith(`_${selectedType}`) &&
                    entry.value.on);
                if (loggedInEntries.length === 0) {
                    yield interaction.reply({ content: `لا يوجد مستخدمين مسجلين دخول في قسم \`${selectedType}\` حالياً.`, ephemeral: true });
                    return;
                }
                const fieldConfig = config_json_1.default.options.find((opt) => opt.name === selectedType);
                if (!fieldConfig) {
                    yield interaction.reply({ content: 'القسم المحدد غير موجود في الإعدادات.', ephemeral: true });
                    return;
                }
                const embed = new discord_js_1.EmbedBuilder()
                    .setTitle(`المستخدمين المسجلين دخول في قسم ${fieldConfig.name}`)
                    .setColor(discord_js_1.Colors.Green)
                    .setTimestamp();
                const userList = loggedInEntries
                    .map((entry, index) => `**${index + 1}. <@${entry.id.split(',')[1].split('_')[0]}>**`)
                    .join('\n');
                embed.setDescription(userList);
                if (fieldConfig.image) {
                    embed.setThumbnail(fieldConfig.image);
                }
                yield interaction.reply({ embeds: [embed], ephemeral: true });
            }
            catch (error) {
                console.error('Error executing show command:', error);
                yield interaction.reply({ content: 'حدث خطأ أثناء تنفيذ الأمر.', ephemeral: true });
            }
        });
    },
};
