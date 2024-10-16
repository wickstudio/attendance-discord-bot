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
    name: 'interactionCreate',
    execute(client, interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (interaction.isCommand()) {
                    const runner = client.commands.get(interaction.commandName);
                    if (runner) {
                        yield runner.execute(client, interaction);
                    }
                    else {
                        console.error(`No command matching ${interaction.commandName} was found.`);
                    }
                }
                else if (interaction.isAnySelectMenu()) {
                    const runner = client.selects.get(interaction.customId);
                    if (runner) {
                        yield runner.execute(client, interaction);
                    }
                    else {
                        console.error(`No select menu handler for ${interaction.customId}`);
                    }
                }
                else if (interaction.isButton()) {
                    const customId = interaction.customId;
                    if (customId.startsWith('manager_off_accept_')) {
                        yield handleManagerOffApproval(client, interaction, 'accept');
                    }
                    else if (customId.startsWith('manager_off_reject_')) {
                        yield handleManagerOffApproval(client, interaction, 'reject');
                    }
                    else if (customId.startsWith('manager_resignation_accept_')) {
                        yield handleManagerResignationApproval(client, interaction, 'accept');
                    }
                    else if (customId.startsWith('manager_resignation_reject_')) {
                        yield handleManagerResignationApproval(client, interaction, 'reject');
                    }
                    else {
                        const runner = client.buttons.find((button) => customId.startsWith(button.name));
                        if (runner) {
                            yield runner.execute(client, interaction);
                        }
                        else {
                            console.error(`No button handler for ${customId}`);
                        }
                    }
                }
                else if (interaction.isModalSubmit()) {
                    const runner = client.modals.find((modal) => interaction.customId.startsWith(modal.name));
                    if (runner) {
                        console.log(`Executing modal handler for: ${runner.name}`);
                        yield runner.execute(client, interaction);
                    }
                    else {
                        console.warn(`No modal handler found for customId: ${interaction.customId}`);
                    }
                }
            }
            catch (error) {
                console.error('Error in interactionCreate event:', error);
            }
        });
    },
};
function handleManagerOffApproval(client, interaction, action) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const customId = interaction.customId;
            const requestId = customId.split('_').pop(); // Extract requestId
            if (!requestId) {
                yield interaction.reply({ content: 'طلب غير صالح.', ephemeral: true });
                return;
            }
            const requestKey = `manager_off_${requestId}`;
            const request = yield client.db.get(requestKey);
            if (!request || request.status !== 'pending') {
                yield interaction.reply({
                    content: 'لم يتم العثور على الطلب أو تم معالجته بالفعل.',
                    ephemeral: true,
                });
                return;
            }
            request.status = action === 'accept' ? 'accepted' : 'rejected';
            request.processedBy = interaction.user.id;
            yield client.db.set(requestKey, request);
            const logMessageId = yield client.db.get(`manager_off_${requestId}_log`);
            if (logMessageId) {
                const logChannel = yield interaction.guild.channels
                    .fetch(config_json_1.default.managerLogChannel)
                    .catch(() => null);
                if (logChannel && logChannel.isTextBased()) {
                    const logMessage = yield logChannel.messages
                        .fetch(logMessageId)
                        .catch(() => null);
                    if (logMessage) {
                        const embed = logMessage.embeds[0];
                        if (embed) {
                            const updatedEmbed = discord_js_1.EmbedBuilder.from(embed);
                            const fields = ((_a = embed.data.fields) === null || _a === void 0 ? void 0 : _a.map((field) => {
                                if (field.name === 'الحالة') {
                                    return {
                                        name: field.name,
                                        value: `**${action === 'accept' ? 'تم القبول' : 'تم الرفض'}** بواسطة <@${interaction.user.id}>`,
                                    };
                                }
                                return field;
                            })) || [];
                            updatedEmbed.setFields(fields);
                            const components = logMessage.components.map((row) => {
                                const newRow = new discord_js_1.ActionRowBuilder();
                                row.components.forEach((component) => {
                                    if (component.type === discord_js_1.ComponentType.Button) {
                                        const button = discord_js_1.ButtonBuilder.from(component);
                                        button.setDisabled(true);
                                        newRow.addComponents(button);
                                    }
                                });
                                return newRow;
                            });
                            yield logMessage.edit({
                                embeds: [updatedEmbed],
                                components: components.map((row) => row.toJSON()),
                            });
                        }
                    }
                }
            }
            const user = yield client.users.fetch(request.userId).catch(() => null);
            if (user) {
                const dmEmbed = new discord_js_1.EmbedBuilder()
                    .setTitle('نتيجة طلب الإجازة')
                    .setColor(action === 'accept' ? discord_js_1.Colors.Green : discord_js_1.Colors.Red)
                    .addFields({
                    name: 'الحالة',
                    value: `**${action === 'accept' ? 'تم القبول' : 'تم الرفض'}**`,
                }, { name: 'تمت المعالجة بواسطة', value: `<@${interaction.user.id}>` })
                    .setTimestamp();
                yield user.send({ embeds: [dmEmbed] }).catch(() => {
                    console.log(`Could not send DM to user ${user.id}`);
                });
            }
            yield interaction.reply({
                content: `تم ${action === 'accept' ? 'قبول' : 'رفض'} الطلب.`,
                ephemeral: true,
            });
        }
        catch (error) {
            console.error('Error in handleManagerOffApproval:', error);
            yield interaction.reply({
                content: 'حدث خطأ أثناء معالجة الطلب.',
                ephemeral: true,
            });
        }
    });
}
function handleManagerResignationApproval(client, interaction, action) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const customId = interaction.customId;
            const requestId = customId.split('_').pop(); // Extract requestId
            if (!requestId) {
                yield interaction.reply({ content: 'طلب غير صالح.', ephemeral: true });
                return;
            }
            const requestKey = `manager_resignation_${requestId}`;
            const request = yield client.db.get(requestKey);
            if (!request || request.status !== 'pending') {
                yield interaction.reply({
                    content: 'لم يتم العثور على الطلب أو تم معالجته بالفعل.',
                    ephemeral: true,
                });
                return;
            }
            request.status = action === 'accept' ? 'accepted' : 'rejected';
            request.processedBy = interaction.user.id;
            yield client.db.set(requestKey, request);
            const logMessageId = yield client.db.get(`manager_resignation_${requestId}_log`);
            if (logMessageId) {
                const logChannel = yield interaction.guild.channels
                    .fetch(config_json_1.default.managerLogChannel)
                    .catch(() => null);
                if (logChannel && logChannel.isTextBased()) {
                    const logMessage = yield logChannel.messages
                        .fetch(logMessageId)
                        .catch(() => null);
                    if (logMessage) {
                        const embed = logMessage.embeds[0];
                        if (embed) {
                            const updatedEmbed = discord_js_1.EmbedBuilder.from(embed);
                            const fields = ((_a = embed.data.fields) === null || _a === void 0 ? void 0 : _a.map((field) => {
                                if (field.name === 'الحالة') {
                                    return {
                                        name: field.name,
                                        value: `**${action === 'accept' ? 'تم القبول' : 'تم الرفض'}** بواسطة <@${interaction.user.id}>`,
                                    };
                                }
                                return field;
                            })) || [];
                            updatedEmbed.setFields(fields);
                            const components = logMessage.components.map((row) => {
                                const newRow = new discord_js_1.ActionRowBuilder();
                                row.components.forEach((component) => {
                                    if (component.type === discord_js_1.ComponentType.Button) {
                                        const button = discord_js_1.ButtonBuilder.from(component);
                                        button.setDisabled(true);
                                        newRow.addComponents(button);
                                    }
                                });
                                return newRow;
                            });
                            yield logMessage.edit({
                                embeds: [updatedEmbed],
                                components: components.map((row) => row.toJSON()),
                            });
                        }
                    }
                }
            }
            const user = yield client.users.fetch(request.userId).catch(() => null);
            if (user) {
                const dmEmbed = new discord_js_1.EmbedBuilder()
                    .setTitle('نتيجة طلب الاستقالة')
                    .setColor(action === 'accept' ? discord_js_1.Colors.Green : discord_js_1.Colors.Red)
                    .addFields({
                    name: 'الحالة',
                    value: `**${action === 'accept' ? 'تم القبول' : 'تم الرفض'}**`,
                }, { name: 'تمت المعالجة بواسطة', value: `<@${interaction.user.id}>` })
                    .setTimestamp();
                yield user.send({ embeds: [dmEmbed] }).catch(() => {
                    console.log(`Could not send DM to user ${user.id}`);
                });
            }
            yield interaction.reply({
                content: `تم ${action === 'accept' ? 'قبول' : 'رفض'} الطلب.`,
                ephemeral: true,
            });
        }
        catch (error) {
            console.error('Error in handleManagerResignationApproval:', error);
            yield interaction.reply({
                content: 'حدث خطأ أثناء معالجة الطلب.',
                ephemeral: true,
            });
        }
    });
}
