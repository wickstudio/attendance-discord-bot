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
const types_1 = require("./utils/types");
const discord_js_1 = require("discord.js");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const config_json_1 = __importDefault(require("./config.json"));
const client = new types_1.CustomClient();
const { TOKEN, CLIENT_ID, GUILD_ID } = config_json_1.default;
if (!TOKEN || !CLIENT_ID) {
    console.error('Error: Missing TOKEN or CLIENT_ID in config.json');
    process.exit(1);
}
const commands = [];
const loadCommands = () => {
    const commandsPath = path_1.default.join(__dirname, 'commands');
    const commandFiles = fs_1.default
        .readdirSync(commandsPath)
        .filter(file => file.endsWith('.js') || file.endsWith('.ts'));
    for (const file of commandFiles) {
        const filePath = path_1.default.join(commandsPath, file);
        const command = require(filePath);
        if ('data' in command && 'execute' in command) {
            client.commands.set(command.data.name, command);
            commands.push(command.data.toJSON());
        }
        else {
            console.warn(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
        }
    }
};
loadCommands();
const rest = new discord_js_1.REST({ version: '10' }).setToken(TOKEN);
const registerCommands = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(`Started refreshing ${commands.length} application (/) commands.`);
        if (GUILD_ID) {
            yield rest.put(discord_js_1.Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), { body: commands });
            console.log(`Successfully registered ${commands.length} guild (/) commands.`);
        }
        else {
            yield rest.put(discord_js_1.Routes.applicationCommands(CLIENT_ID), { body: commands });
            console.log(`Successfully registered ${commands.length} global (/) commands.`);
        }
    }
    catch (error) {
        console.error('Error registering slash commands:', error);
    }
});
registerCommands();
const loadEvents = () => {
    const eventsPath = path_1.default.join(__dirname, 'events');
    const eventFiles = fs_1.default
        .readdirSync(eventsPath)
        .filter(file => file.endsWith('.js') || file.endsWith('.ts'));
    for (const file of eventFiles) {
        const filePath = path_1.default.join(eventsPath, file);
        const event = require(filePath);
        if (event.once) {
            client.once(event.name, (...args) => event.execute(client, ...args));
        }
        else {
            client.on(event.name, (...args) => event.execute(client, ...args));
        }
    }
};
loadEvents();
const loadSelects = () => {
    const selectsPath = path_1.default.join(__dirname, 'selects');
    const selectFiles = fs_1.default
        .readdirSync(selectsPath)
        .filter(file => file.endsWith('.js') || file.endsWith('.ts'));
    for (const file of selectFiles) {
        const filePath = path_1.default.join(selectsPath, file);
        const select = require(filePath);
        client.selects.set(select.name, select);
    }
};
loadSelects();
const loadButtons = () => {
    const buttonsPath = path_1.default.join(__dirname, 'buttons');
    const buttonFiles = fs_1.default
        .readdirSync(buttonsPath)
        .filter(file => file.endsWith('.js') || file.endsWith('.ts'));
    for (const file of buttonFiles) {
        const filePath = path_1.default.join(buttonsPath, file);
        const button = require(filePath);
        client.buttons.set(button.name, button);
    }
};
loadButtons();
const loadModals = () => {
    const modalsPath = path_1.default.join(__dirname, 'modals');
    const modalFiles = fs_1.default
        .readdirSync(modalsPath)
        .filter(file => file.endsWith('.js') || file.endsWith('.ts'));
    for (const file of modalFiles) {
        const filePath = path_1.default.join(modalsPath, file);
        const modal = require(filePath);
        client.modals.set(modal.name, modal);
    }
};
loadModals();
client.once('ready', () => {
    var _a;
    console.log(`Bot is online! Logged in as ${(_a = client.user) === null || _a === void 0 ? void 0 : _a.tag}`);
    console.log('Code by Wick Studio');
    console.log('discord.gg/wicks');
});
client.login(TOKEN);
