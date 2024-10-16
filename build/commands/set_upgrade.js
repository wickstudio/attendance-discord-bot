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
    name: 'set_upgrade',
    data: new discord_js_1.SlashCommandBuilder()
        .setName('set_upgrade')
        .setDescription('إعداد ترقية دور بناءً على مدة تسجيل الدخول لقسم معين')
        .addStringOption((option) => option
        .setName('section')
        .setDescription('اسم القسم')
        .setRequired(true)
        .addChoices(...config_json_1.default.options.map((option) => ({ name: option.name, value: option.name }))))
        .addStringOption((option) => option
        .setName('action')
        .setDescription('الإجراء المطلوب')
        .setRequired(true)
        .addChoices({ name: 'تفعيل', value: 'enable' }, { name: 'تعطيل', value: 'disable' }, { name: 'إعادة تعيين', value: 'reset' }))
        .addStringOption((option) => option
        .setName('login_duration')
        .setDescription('مدة تسجيل الدخول المطلوبة (مثال: 5h, 2d)')
        .setRequired(false))
        .addRoleOption((option) => option
        .setName('role')
        .setDescription('الدور الذي سيتم منحه عند الوصول للمدة')
        .setRequired(false)),
    execute(client, interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const section = interaction.options.getString('section', true);
                const action = interaction.options.getString('action', true);
                const durationInput = interaction.options.getString('login_duration');
                const role = interaction.options.getRole('role');
                const Field = config_json_1.default.options.find((field) => field.name === section);
                if (!Field) {
                    return interaction.reply({ content: 'القسم المحدد غير موجود.', ephemeral: true });
                }
                if (!Field.admins.includes(interaction.user.id)) {
                    return interaction.reply({ content: 'ليس لديك صلاحية لإدارة هذا القسم.', ephemeral: true });
                }
                const upgradesKey = `upgrades_${interaction.guild.id}_${section}`;
                let upgrades = (yield client.db.get(upgradesKey)) || [];
                if (action === 'enable') {
                    if (!durationInput || !role) {
                        return interaction.reply({ content: 'يرجى تحديد مدة تسجيل الدخول والدور عند التفعيل.', ephemeral: true });
                    }
                    const durationMs = (0, ms_1.default)(durationInput);
                    if (!durationMs || typeof durationMs !== 'number') {
                        return interaction.reply({
                            content: 'تنسيق المدة غير صالح. الرجاء استخدام تنسيقات مثل "5h" أو "2d".',
                            ephemeral: true,
                        });
                    }
                    const existingUpgrade = upgrades.find((upgrade) => upgrade.durationMs === durationMs && upgrade.enabled);
                    if (existingUpgrade) {
                        return interaction.reply({
                            content: 'هناك ترقية بنفس المدة موجودة بالفعل لهذا القسم.',
                            ephemeral: true,
                        });
                    }
                    upgrades.push({
                        durationMs,
                        roleId: role.id,
                        enabled: true,
                    });
                    upgrades.sort((a, b) => a.durationMs - b.durationMs);
                    yield client.db.set(upgradesKey, upgrades);
                    const durationText = (0, ms_1.default)(durationMs, { long: true }) || '';
                    return interaction.reply({
                        content: `تم إعداد الترقية! عند وصول المستخدم إلى ${durationText} في قسم ${section}، سيتم منحه الدور ${role.toString()}.`,
                        ephemeral: true,
                    });
                }
                else if (action === 'disable') {
                    if (upgrades.length === 0 || !upgrades.some((upgrade) => upgrade.enabled)) {
                        return interaction.reply({ content: 'لا توجد ترقيات مفعلة لهذا القسم.', ephemeral: true });
                    }
                    upgrades = upgrades.map((upgrade) => (Object.assign(Object.assign({}, upgrade), { enabled: false })));
                    yield client.db.set(upgradesKey, upgrades);
                    return interaction.reply({
                        content: `تم تعطيل جميع الترقيات لقسم ${section}.`,
                        ephemeral: true,
                    });
                }
                else if (action === 'reset') {
                    if (!durationInput || !role) {
                        return interaction.reply({ content: 'يرجى تحديد مدة تسجيل الدخول والدور عند إعادة التعيين.', ephemeral: true });
                    }
                    const durationMs = (0, ms_1.default)(durationInput);
                    if (!durationMs || typeof durationMs !== 'number') {
                        return interaction.reply({
                            content: 'تنسيق المدة غير صالح. الرجاء استخدام تنسيقات مثل "5h" أو "2d".',
                            ephemeral: true,
                        });
                    }
                    const upgradeIndex = upgrades.findIndex((upgrade) => upgrade.durationMs === durationMs);
                    if (upgradeIndex === -1) {
                        return interaction.reply({
                            content: 'لا توجد ترقية بهذه المدة لإعادة تعيينها.',
                            ephemeral: true,
                        });
                    }
                    upgrades[upgradeIndex] = {
                        durationMs,
                        roleId: role.id,
                        enabled: true,
                    };
                    yield client.db.set(upgradesKey, upgrades);
                    const durationText = (0, ms_1.default)(durationMs, { long: true }) || '';
                    return interaction.reply({
                        content: `تم إعادة تعيين الترقية! عند وصول المستخدم إلى ${durationText} في قسم ${section}، سيتم منحه الدور ${role.toString()}.`,
                        ephemeral: true,
                    });
                }
                else {
                    return interaction.reply({ content: 'إجراء غير صالح.', ephemeral: true });
                }
            }
            catch (error) {
                console.error('Error executing set_upgrade command:', error);
                yield interaction.reply({
                    content: 'حدث خطأ أثناء تنفيذ الأمر. يرجى المحاولة مرة أخرى لاحقًا.',
                    ephemeral: true,
                });
            }
        });
    },
};
