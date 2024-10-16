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
    name: 'manager_off',
    execute(client, interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const modal = new discord_js_1.ModalBuilder()
                    .setCustomId('manager_off_modal')
                    .setTitle('طلب إجازة');
                const nameInput = new discord_js_1.TextInputBuilder()
                    .setCustomId('off_name')
                    .setLabel('الاسم')
                    .setStyle(discord_js_1.TextInputStyle.Short)
                    .setRequired(true);
                const reasonInput = new discord_js_1.TextInputBuilder()
                    .setCustomId('off_reason')
                    .setLabel('السبب')
                    .setStyle(discord_js_1.TextInputStyle.Paragraph)
                    .setRequired(true);
                const durationInput = new discord_js_1.TextInputBuilder()
                    .setCustomId('off_duration')
                    .setLabel('المدة (مثال: 2d, 3h)')
                    .setStyle(discord_js_1.TextInputStyle.Short)
                    .setRequired(true);
                const firstActionRow = new discord_js_1.ActionRowBuilder().addComponents(nameInput);
                const secondActionRow = new discord_js_1.ActionRowBuilder().addComponents(reasonInput);
                const thirdActionRow = new discord_js_1.ActionRowBuilder().addComponents(durationInput);
                modal.addComponents(firstActionRow, secondActionRow, thirdActionRow);
                yield interaction.showModal(modal);
            }
            catch (error) {
                console.error('Error handling manager_off button:', error);
                yield interaction.reply({
                    content: 'حدث خطأ أثناء تنفيذ العملية.',
                    ephemeral: true,
                });
            }
        });
    },
};
