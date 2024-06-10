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
module.exports = {
    name: 'interactionCreate',
    execute(client, interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            // Handle Commands
            if (interaction.isCommand()) {
                const runner = client.commands.get(interaction.commandName);
                if (runner)
                    runner.execute(client, interaction);
                // Handle Menu selection
            }
            else if (interaction.isAnySelectMenu()) {
                const runner = client.selects.get(interaction.customId);
                if (runner)
                    runner.execute(client, interaction);
                // Handle Buttons interaction
            }
            else if (interaction.isButton() || interaction.isModalSubmit()) {
                const runner = client.buttons.filter((key, value) => interaction.customId.startsWith(key.name));
                if (runner.first())
                    runner.first().execute(client, interaction);
            }
        });
    },
};
