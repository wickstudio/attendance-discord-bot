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
const humanize_duration_1 = __importDefault(require("humanize-duration"));
const config_json_1 = __importDefault(require("../config.json"));
module.exports = {
    name: 'total',
    data: new discord_js_1.SlashCommandBuilder()
        .setName('total')
        .setDescription('عرض الوقت الذي تواجدت فيه انت او شخص أخر')
        .addStringOption((option) => option
        .setName('type')
        .setDescription('اسم القسم')
        .addChoices(...config_json_1.default.options.map((option) => ({ name: option.name, value: option.name })))
        .setRequired(true))
        .addUserOption((option) => option.setName('user').setDescription('الشخص الذي تريد العرض عنه')),
    execute(client, interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = interaction.options.get('user') || interaction;
            const field = interaction.options.get('type');
            let savedUser = yield client.db.get(`${interaction.guild.id},${user.user.id}_${field === null || field === void 0 ? void 0 : field.value}`);
            if (!savedUser)
                savedUser = { allTime: 0 };
            const time = (0, humanize_duration_1.default)(savedUser.allTime, { language: 'ar', maxDecimalPoints: 0 });
            const timeEmbed = new discord_js_1.EmbedBuilder()
                .setAuthor({ name: user.user.username, iconURL: user.user.avatarURL() })
                .addFields({
                name: '**الشخص:[`🧔`]**',
                value: `**<@${user.user.id}>**`,
            }, {
                name: '**القسم:[`📌`]**',
                value: `**${field.value}**`,
            }, {
                name: '**الوقت:[`⏰`]**',
                value: `**[\`${time}\`]**`,
            })
                .setColor(discord_js_1.Colors.Green);
            yield interaction.reply({ embeds: [timeEmbed], ephemeral: true });
        });
    },
};
