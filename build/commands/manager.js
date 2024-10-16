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
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
module.exports = {
    name: 'manager',
    data: new discord_js_1.SlashCommandBuilder()
        .setName('manager')
        .setDescription('عرض خيارات المدير (طلب إجازة أو استقالة)'),
    execute(client, interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const askOffButton = new discord_js_1.ButtonBuilder()
                    .setCustomId('manager_off')
                    .setLabel('طلب إجازة')
                    .setStyle(discord_js_1.ButtonStyle.Primary)
                    .setEmoji('🛌');
                const resignationButton = new discord_js_1.ButtonBuilder()
                    .setCustomId('manager_resignation')
                    .setLabel('استقالة')
                    .setStyle(discord_js_1.ButtonStyle.Danger)
                    .setEmoji('✍️');
                const row = new discord_js_1.ActionRowBuilder().addComponents(askOffButton, resignationButton);
                const embed = new discord_js_1.EmbedBuilder()
                    .setTitle('خيارات المدير')
                    .setDescription('اختر الإجراء الذي تريد القيام به:')
                    .setColor('Blue');
                yield interaction.reply({
                    embeds: [embed],
                    components: [row],
                });
            }
            catch (error) {
                console.error('Error executing /manager command:', error);
                yield interaction.reply({
                    content: 'حدث خطأ أثناء تنفيذ الأمر.',
                    ephemeral: true,
                });
            }
        });
    },
};
