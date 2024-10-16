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
const uuid_1 = require("uuid");
const ms_1 = __importDefault(require("ms"));
module.exports = {
    name: 'manager_off_modal',
    execute(client, interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const guildId = interaction.guild.id;
                const userId = interaction.user.id;
                const name = interaction.fields.getTextInputValue('off_name');
                const reason = interaction.fields.getTextInputValue('off_reason');
                const duration = interaction.fields.getTextInputValue('off_duration');
                const durationMs = (0, ms_1.default)(duration);
                if (!durationMs) {
                    yield interaction.reply({
                        content: 'تنسيق المدة غير صحيح. الرجاء استخدام تنسيقات مثل `2d` أو `3h`.',
                        ephemeral: true,
                    });
                    return;
                }
                const requestId = (0, uuid_1.v4)();
                yield client.db.set(`manager_off_${requestId}`, {
                    guildId,
                    userId,
                    name,
                    reason,
                    duration,
                    status: 'pending',
                });
                const embed = new discord_js_1.EmbedBuilder()
                    .setTitle('طلب إجازة')
                    .addFields({ name: 'الاسم', value: `**${name}**`, inline: true }, { name: 'المستخدم', value: `<@${userId}>`, inline: true }, { name: 'السبب', value: `**${reason}**` }, { name: 'المدة', value: `**${duration}**` }, { name: 'الحالة', value: '**قيد الانتظار**' })
                    .setColor(discord_js_1.Colors.Yellow)
                    .setTimestamp();
                const acceptButton = new discord_js_1.ButtonBuilder()
                    .setCustomId(`manager_off_accept_${requestId}`)
                    .setLabel('قبول')
                    .setStyle(discord_js_1.ButtonStyle.Success);
                const rejectButton = new discord_js_1.ButtonBuilder()
                    .setCustomId(`manager_off_reject_${requestId}`)
                    .setLabel('رفض')
                    .setStyle(discord_js_1.ButtonStyle.Danger);
                const row = new discord_js_1.ActionRowBuilder().addComponents(acceptButton, rejectButton);
                const logChannelId = config_json_1.default.managerLogChannel;
                const logChannel = yield interaction.guild.channels
                    .fetch(logChannelId)
                    .catch(() => null);
                if (!logChannel || !logChannel.isTextBased()) {
                    yield interaction.reply({
                        content: 'لم يتم العثور على قناة السجلات أو أنها ليست قناة نصية.',
                        ephemeral: true,
                    });
                    return;
                }
                const logMessage = yield logChannel.send({
                    embeds: [embed],
                    components: [row],
                });
                yield client.db.set(`manager_off_${requestId}_log`, logMessage.id);
                yield interaction.reply({
                    content: 'تم إرسال طلب الإجازة وهو قيد المراجعة.',
                    ephemeral: true,
                });
            }
            catch (error) {
                console.error('Error handling manager_off_modal:', error);
                yield interaction.reply({
                    content: 'حدث خطأ أثناء معالجة طلبك.',
                    ephemeral: true,
                });
            }
        });
    },
};
