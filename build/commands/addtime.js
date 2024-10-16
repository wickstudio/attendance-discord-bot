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
const ms_1 = __importDefault(require("ms"));
const config_json_1 = __importDefault(require("../config.json"));
module.exports = {
    name: 'add_time',
    data: new discord_js_1.SlashCommandBuilder()
        .setName('add_time')
        .setDescription('اضافة وقت لشخص ما')
        .addUserOption(option => option.setName('user').setDescription('الشخص الذي تريد إضافة الوقت له').setRequired(true))
        .addStringOption(option => option
        .setName('type')
        .setDescription('القسم الذي تريد اضافة الوقت به')
        .addChoices(...config_json_1.default.options.map(option => ({ name: option.name, value: option.name })))
        .setRequired(true))
        .addStringOption(option => option.setName('time').setDescription('1m 1h 1d | الوقت الذي تريد اضافته').setRequired(true)),
    execute(client, interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            const userOption = interaction.options.getUser('user', true);
            const fieldOption = interaction.options.getString('type', true);
            const timeOption = interaction.options.getString('time', true);
            const Field = config_json_1.default.options.find(Field => Field.name == fieldOption);
            if (!(Field === null || Field === void 0 ? void 0 : Field.admins.includes(interaction.user.id))) {
                return interaction.reply({ content: 'لا يوجد لديك صلاحية', ephemeral: true });
            }
            try {
                const parseTime = (0, ms_1.default)(timeOption);
                if (!parseTime) {
                    yield interaction.reply({ content: 'خطأ في تنسيق الوقت', ephemeral: true });
                    return;
                }
                const userKey = `${interaction.guild.id},${userOption.id}_${fieldOption}`;
                const savedUser = (yield client.db.get(userKey)) || { username: userOption.username, on: false, allTime: 0 };
                const newAllTime = savedUser.allTime + parseTime;
                yield client.db.set(userKey, Object.assign(Object.assign({}, savedUser), { allTime: newAllTime }));
                const upgradesKey = `upgrades_${interaction.guild.id}_${fieldOption}`;
                const upgrades = (yield client.db.get(upgradesKey)) || [];
                const member = yield interaction.guild.members.fetch(userOption.id);
                for (const upgrade of upgrades) {
                    if (member.roles.cache.has(upgrade.roleId))
                        continue;
                    if (newAllTime >= upgrade.durationMs) {
                        yield member.roles.add(upgrade.roleId).catch(console.error);
                        const role = interaction.guild.roles.cache.get(upgrade.roleId);
                        if (role) {
                            yield userOption.send(`Congratulations! You have been awarded the role ${role.name} for accumulating ${(0, ms_1.default)(upgrade.durationMs, { long: true })} in ${fieldOption}.`).catch(() => { });
                        }
                    }
                }
                yield interaction.reply({ content: 'تم إضافة الوقت بنجاح', ephemeral: true });
            }
            catch (error) {
                console.error('Error in add_time command:', error);
                yield interaction.reply({ content: 'حدث خطأ أثناء تنفيذ الأمر.', ephemeral: true });
            }
        });
    },
};
