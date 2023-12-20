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
    name: 'list',
    data: new discord_js_1.SlashCommandBuilder()
        .setName('list')
        .setDescription('عرض قائمة مسجلين الدخول')
        .addStringOption((option) => option
        .setName('type')
        .setDescription('القسم الذي تريد عرض القائمة له')
        .addChoices(...config_json_1.default.options.map((option) => ({ name: option.name, value: option.name })))
        .setRequired(true)),
    execute(client, interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            const field = interaction.options.get('type');
            const Field = config_json_1.default.options.find((Field) => Field.name == field.value);
            const data = (yield client.db.all())
                .filter((data) => data.id.endsWith(field.value) && data.value.on)
                .sort((a, b) => b.value.lastLogin - a.value.lastLogin);
            const loggedInUsers = `${data.map((user, index) => `**[${index + 1}] <@${user.id.split('_')[0].split(',')[1]}>** ● \`${new Date(user.value.lastLogin).toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
            })}\`\n`)}` || 'لا يوجد مسجلين دخول حاليا في هذا لقسم';
            const embed = new discord_js_1.EmbedBuilder()
                .setTitle(`قائمة المسجلين في قسم ${field.value}`)
                .setThumbnail(Field.image)
                .setDescription(loggedInUsers);
            yield interaction.reply({ embeds: [embed], ephemeral: true });
        });
    },
};
