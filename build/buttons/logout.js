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
    name: 'logout',
    execute(client, interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            if (interaction.isButton()) {
                const action = interaction.customId.split('_')[1]; // Extract the action
                const modal = new discord_js_1.ModalBuilder()
                    .setCustomId(`logout_${action}`)
                    .setTitle('التقرير اليومي');
                const reportInput = new discord_js_1.TextInputBuilder()
                    .setCustomId('reportInput')
                    .setLabel('تقرير الخروج')
                    .setStyle(discord_js_1.TextInputStyle.Paragraph);
                const actionRow = new discord_js_1.ActionRowBuilder().addComponents(reportInput);
                modal.addComponents(actionRow);
                yield interaction.showModal(modal);
            }
        });
    },
};
