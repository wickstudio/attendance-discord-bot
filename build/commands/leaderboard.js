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
const canvas_1 = require("canvas");
const config_json_1 = __importDefault(require("../config.json"));
module.exports = {
    name: 'leaderboard',
    data: new discord_js_1.SlashCommandBuilder()
        .setName('leaderboard')
        .setDescription('عرض قائمة الأوائل')
        .addStringOption((option) => option
        .setName('type')
        .setDescription('اسم القسم')
        .addChoices(...config_json_1.default.options.map((option) => ({ name: option.name, value: option.name })))
        .setRequired(true)),
    execute(client, interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield interaction.deferReply({ ephemeral: true });
                const field = interaction.options.get('type');
                const Field = config_json_1.default.options.find((Field) => Field.name == field.value);
                const fieldImage = Field === null || Field === void 0 ? void 0 : Field.image; // Store the field image URL
                const data = (yield client.db.all())
                    .filter((data) => data.id.endsWith(field.value))
                    .sort((a, b) => b.value.allTime - a.value.allTime)
                    .slice(0, 12);
                const canvas = (0, canvas_1.createCanvas)(800, 600);
                const ctx = canvas.getContext('2d');
                const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
                gradient.addColorStop(0, '#2f3136');
                gradient.addColorStop(1, '#1a1c1f');
                ctx.fillStyle = gradient;
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.font = '36px Arial';
                ctx.fillStyle = '#ffffff';
                ctx.fillText('Leaderboard', 90, 55);
                ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
                ctx.lineWidth = 1;
                const leaderboardX = 40;
                const leaderboardY = 90;
                const leaderboardWidth = 720;
                const entryHeight = 40;
                ctx.strokeRect(leaderboardX, leaderboardY, leaderboardWidth, data.length * entryHeight);
                for (let i = 1; i < data.length; i++) {
                    const y = leaderboardY + i * entryHeight - 0.5;
                    ctx.beginPath();
                    ctx.moveTo(leaderboardX, y);
                    ctx.lineTo(leaderboardX + leaderboardWidth, y);
                    ctx.stroke();
                }
                if (fieldImage === null || fieldImage === void 0 ? void 0 : fieldImage.length) {
                    try {
                        const image = yield (0, canvas_1.loadImage)(fieldImage);
                        const imageSize = 60;
                        const imageX = 25;
                        const imageY = 15;
                        ctx.save();
                        ctx.beginPath();
                        ctx.arc(imageX + imageSize / 2, imageY + imageSize / 2, imageSize / 2, 0, Math.PI * 2);
                        ctx.closePath();
                        ctx.clip();
                        ctx.drawImage(image, imageX, imageY, imageSize, imageSize);
                        ctx.restore();
                    }
                    catch (error) {
                        console.error('Error loading field image:', error);
                    }
                }
                ctx.font = '24px Arial';
                ctx.fillStyle = '#ffffff';
                data.forEach((user, index) => {
                    const alltimeInHours = user.value.allTime / (1000 * 60 * 60);
                    ctx.fillText(`#${index + 1}: ${user.value.username}`, 50, 130 + index * entryHeight - 12); // Adjust the coordinates as needed
                    ctx.fillText(`${alltimeInHours.toFixed(0)} hours 🏆`, 600, 130 + index * entryHeight - 12); // Adjust the coordinates as needed
                });
                const attachment = new discord_js_1.AttachmentBuilder(canvas.toBuffer(), { name: 'leaderboard.png' });
                const embed = new discord_js_1.EmbedBuilder()
                    .setTitle('Leaderboard')
                    .setDescription('Top players based on hours played')
                    .setImage('attachment://leaderboard.png');
                yield interaction.editReply({ embeds: [embed], files: [attachment] });
            }
            catch (error) {
                console.error('Error executing leaderboard command:', error);
                if (!interaction.replied && !interaction.deferred) {
                    yield interaction.reply({ content: 'حدث خطأ أثناء تنفيذ الأمر.', ephemeral: true });
                }
                else {
                    yield interaction.editReply({ content: 'حدث خطأ أثناء تنفيذ الأمر.' });
                }
            }
        });
    },
};
