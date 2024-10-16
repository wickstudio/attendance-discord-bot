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
    name: 'list_upgrades',
    data: new discord_js_1.SlashCommandBuilder()
        .setName('list_upgrades')
        .setDescription('List the upgrades for a section')
        .addStringOption(option => option
        .setName('section')
        .setDescription('Section name')
        .setRequired(true)
        .addChoices(...config_json_1.default.options.map(option => ({ name: option.name, value: option.name })))),
    execute(client, interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const section = interaction.options.getString('section', true);
                const upgradesKey = `upgrades_${interaction.guild.id}_${section}`;
                const upgrades = (yield client.db.get(upgradesKey)) || [];
                if (upgrades.length === 0) {
                    yield interaction.reply({ content: `No upgrades have been set for the section ${section}.`, ephemeral: true });
                    return;
                }
                const upgradeList = upgrades
                    .map((upgrade, index) => {
                    const role = interaction.guild.roles.cache.get(upgrade.roleId);
                    const roleName = role ? role.name : 'Unknown Role';
                    return `**${index + 1}.** Role: **${roleName}**, Duration: **${(0, ms_1.default)(upgrade.durationMs, { long: true })}**`;
                })
                    .join('\n');
                const embed = new discord_js_1.EmbedBuilder()
                    .setTitle(`Upgrades for ${section}`)
                    .setDescription(upgradeList)
                    .setColor(discord_js_1.Colors.Blue);
                yield interaction.reply({ embeds: [embed], ephemeral: true });
            }
            catch (error) {
                console.error('Error executing list_upgrades command:', error);
                yield interaction.reply({ content: 'An error occurred while executing the command.', ephemeral: true });
            }
        });
    },
};
