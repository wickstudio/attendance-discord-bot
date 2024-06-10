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
    data: new discord_js_1.SlashCommandBuilder().setName('setup').setDescription('اعداد رسالة التحضير'),
    execute(client, interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!config_json_1.default.options.filter((field) => field.admins.includes(interaction.user.id)).length) {
                yield interaction.reply({ content: 'ليس لديك صلاحية لإدارة الأقسام', ephemeral: true });
                return;
            }
            const select = new discord_js_1.StringSelectMenuBuilder()
                .setCustomId('setup')
                .setPlaceholder('اختر القسم الذي تريد انشاء رسالة تحضير له')
                .addOptions(config_json_1.default.options
                .filter((field) => field.admins.includes(interaction.user.id))
                .map((option) => {
                const optionBuilder = new discord_js_1.StringSelectMenuOptionBuilder().setLabel(option.name).setValue(option.name);
                if (option.emoji) {
                    optionBuilder.setEmoji(option.emoji);
                }
                return optionBuilder;
            }));
            const row = new discord_js_1.ActionRowBuilder().addComponents(select);
            yield interaction.reply({ components: [row], ephemeral: true });
        });
    },
};
