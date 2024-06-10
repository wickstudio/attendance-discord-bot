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
    name: 'reset',
    data: new discord_js_1.SlashCommandBuilder()
        .setName('reset')
        .setDescription('اعادة تعيين الوقت لعضو')
        .addUserOption((option) => option.setName('user').setDescription('الشخص الذي تريد اعادة تعييم الوقت له').setRequired(true))
        .addStringOption((option) => option
        .setName('type')
        .setDescription('القسم الذي تريد اعادة تعيين الوقت به')
        .addChoices(...config_json_1.default.options.map((option) => ({ name: option.name, value: option.name })))
        .setRequired(true)),
    execute(client, interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = interaction.options.get('user');
            const field = interaction.options.get('type');
            client.db.set(`${interaction.guild.id},${user.user.id}_${field === null || field === void 0 ? void 0 : field.value}`, {
                username: user.user.username,
                on: false,
                allTime: 0,
            });
            yield interaction.reply({ content: 'تم اعادة تعيين الوقت بنجاح', ephemeral: true });
        });
    },
};
