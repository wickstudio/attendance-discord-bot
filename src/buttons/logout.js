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
    name: 'logout',
    execute(client, interaction) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            if (interaction.isButton()) {
                // Create the modal
                const modal = new discord_js_1.ModalBuilder().setCustomId(interaction.customId).setTitle('التقرير اليومي');
                const reportInput = new discord_js_1.TextInputBuilder()
                    .setCustomId('reportInput')
                    .setLabel('تقرير الخروج')
                    // Paragraph means multiple lines of text.
                    .setStyle(discord_js_1.TextInputStyle.Paragraph);
                const ActionRow = new discord_js_1.ActionRowBuilder().addComponents(reportInput);
                modal.addComponents(ActionRow);
                yield interaction.showModal(modal);
            }
            else if (interaction.isModalSubmit()) {
                const report = interaction.fields.getTextInputValue('reportInput');
                const action = interaction.customId.split('_')[1];
                const field = config_json_1.default.options.find((field) => field.name == action);
                if (!field)
                    return interaction.reply({ ephemeral: true, content: 'القسم غير موجود' });
                const user = yield client.db.get(`${interaction.guild.id},${interaction.user.id}_${action}`);
                if (user) {
                    if (!user.on) {
                        interaction.reply({ content: 'لم تسجل دخولك بعد', ephemeral: true });
                        return;
                    }
                    else {
                        const allTime = user.allTime + (Date.now() - user.lastLogin);
                        yield client.db.set(`${interaction.guild.id},${interaction.user.id}_${action}`, Object.assign(Object.assign({}, user), { on: false, allTime: allTime }));
                        interaction.reply({ content: 'تم تسجيل خروجك بنجاح', ephemeral: true });
                        const userAvatar = interaction.user.avatarURL();
                        const loginEmbed = new discord_js_1.EmbedBuilder()
                            .setAuthor({ name: interaction.user.username, iconURL: userAvatar })
                            .setTitle('تسجيل خروج')
                            .setThumbnail(field.image)
                            .addFields({
                            name: '**الشخص:[`🧔`]**',
                            value: `**<@${interaction.user.id}>**`,
                        }, {
                            name: '**القسم:[`📌`]**',
                            value: `**${field.name} [<@&${field.role}>]**`,
                        }, {
                            name: '**الوقت:[`⏰`]**',
                            value: `**[\`${new Date().toLocaleString()}\`]**`,
                        }, {
                            name: '**التقرير:[`🗒️`]**',
                            value: `\`\`\`\n${report}\`\`\``,
                        })
                            .setColor(discord_js_1.Colors.Red);
                        const LogChannel = yield ((_a = interaction.guild) === null || _a === void 0 ? void 0 : _a.channels.cache.get(field.logchannel));
                        if (LogChannel && LogChannel.type == discord_js_1.ChannelType.GuildText) {
                            yield LogChannel.send({ embeds: [loginEmbed] });
                        }
                    }
                }
                else {
                    interaction.reply({ content: 'لم تسجل دخولك بعد', ephemeral: true });
                }
            }
        });
    },
};
