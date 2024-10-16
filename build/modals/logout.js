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
const ms_1 = __importDefault(require("ms"));
module.exports = {
    name: 'logout',
    execute(client, interaction) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const report = interaction.fields.getTextInputValue('reportInput');
                const action = interaction.customId.split('_')[1];
                const field = config_json_1.default.options.find((field) => field.name == action);
                if (!field) {
                    return interaction.reply({ ephemeral: true, content: 'القسم غير موجود' });
                }
                const userKey = `${interaction.guild.id},${interaction.user.id}_${action}`;
                const user = yield client.db.get(userKey);
                if (user) {
                    if (!user.on) {
                        return interaction.reply({ content: 'لم تسجل دخولك بعد', ephemeral: true });
                    }
                    else {
                        const sessionTime = Date.now() - user.lastLogin;
                        const allTime = user.allTime + sessionTime;
                        yield client.db.set(userKey, Object.assign(Object.assign({}, user), { on: false, allTime }));
                        const userAvatar = interaction.user.avatarURL() || '';
                        const logoutEmbed = new discord_js_1.EmbedBuilder()
                            .setAuthor({ name: interaction.user.username, iconURL: userAvatar })
                            .setTitle('تسجيل خروج')
                            .setThumbnail(field.image)
                            .addFields({ name: '**الشخص:[`🧔`]**', value: `**<@${interaction.user.id}>**` }, { name: '**القسم:[`📌`]**', value: `**${field.name} [<@&${field.role}>]**` }, { name: '**الوقت:[`⏰`]**', value: `**[\`${new Date().toLocaleString()}\`]**` }, { name: '**التقرير:[`🗒️`]**', value: `\`\`\`\n${report}\`\`\`` })
                            .setColor(discord_js_1.Colors.Red);
                        const logChannel = (_a = interaction.guild) === null || _a === void 0 ? void 0 : _a.channels.cache.get(field.logchannel);
                        if (logChannel === null || logChannel === void 0 ? void 0 : logChannel.isTextBased()) {
                            yield logChannel.send({ embeds: [logoutEmbed] });
                        }
                        const upgradesKey = `upgrades_${interaction.guild.id}_${action}`;
                        const upgrades = (yield client.db.get(upgradesKey)) || [];
                        const member = interaction.member;
                        if (!member || !(member instanceof discord_js_1.GuildMember)) {
                            return interaction.reply({ content: 'Cannot retrieve your member information.', ephemeral: true });
                        }
                        for (const upgrade of upgrades) {
                            if (member.roles.cache.has(upgrade.roleId))
                                continue;
                            if (allTime >= upgrade.durationMs) {
                                yield member.roles.add(upgrade.roleId).catch(console.error);
                                const role = interaction.guild.roles.cache.get(upgrade.roleId);
                                if (role) {
                                    yield interaction.user
                                        .send(`تهانينا! لقد تم منحك رتبة ${role.name} لتجميعك ${(0, ms_1.default)(upgrade.durationMs, { long: true })} في قسم ${field.name}.`);
                                }
                            }
                        }
                        return interaction.reply({ content: 'تم تسجيل خروجك بنجاح', ephemeral: true });
                    }
                }
                else {
                    return interaction.reply({ content: 'لم تسجل دخولك بعد', ephemeral: true });
                }
            }
            catch (error) {
                console.error('Error in logout modal handler:', error);
                yield interaction.reply({ content: 'حدث خطأ أثناء معالجة طلبك.', ephemeral: true });
            }
        });
    },
};
