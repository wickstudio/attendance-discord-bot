"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomClient = void 0;
const discord_js_1 = require("discord.js");
const quick_db_1 = require("quick.db");
class CustomClient extends discord_js_1.Client {
    constructor() {
        super({ intents: ['Guilds', 'GuildMessages'] });
        this.commands = new discord_js_1.Collection();
        this.interactions = new discord_js_1.Collection();
        this.selects = new discord_js_1.Collection();
        this.buttons = new discord_js_1.Collection();
        this.db = new quick_db_1.QuickDB();
    }
}
exports.CustomClient = CustomClient;
