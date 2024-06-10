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
    name: 'setup',
    execute(client, interaction) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const value = interaction.values[0];
            const field = config_json_1.default.options.find((field) => field.name == value);
            const icon = interaction.guild.iconURL();
            const login = new discord_js_1.ButtonBuilder().setCustomId(`login_${value}`).setLabel('تسجيل الدخول').setEmoji('🔒').setStyle(discord_js_1.ButtonStyle.Success);
            const logout = new discord_js_1.ButtonBuilder().setCustomId(`logout_${value}`).setLabel('تسجيل الخروج').setEmoji('🔓').setStyle(discord_js_1.ButtonStyle.Danger);
            const embed = new discord_js_1.EmbedBuilder()
                .setAuthor({ iconURL: icon, name: interaction.guild.name })
                .setFields({
                name: value,
                value: `تسجيل الدخول إلى ${value}`,
            })
                .setThumbnail(field.image);
            const row = new discord_js_1.ActionRowBuilder().addComponents(login, logout);
            (_a = interaction.channel) === null || _a === void 0 ? void 0 : _a.send({ embeds: [embed], components: [row] });
            interaction.reply({ content: 'تم الإنشاء بنجاح', ephemeral: true });
        });
    },
};
