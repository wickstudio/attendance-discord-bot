"use strict";
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const ms_1 = __importDefault(require("ms"));
const config_json_1 = __importDefault(require("../config.json"));
module.exports = {
  name: "remove_time",
  data: new discord_js_1.SlashCommandBuilder()
    .setName("remove_time")
    .setDescription("اضافة وقت لشخص ما")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("الشخص الذي تريد ازالة وقت منه")
        .setRequired(true),
    )
    .addStringOption((option) =>
      option
        .setName("type")
        .setDescription("القسم الذي تريد ازالة الوقت به")
        .addChoices(
          ...config_json_1.default.options.map((option) => ({
            name: option.name,
            value: option.name,
          })),
        )
        .setRequired(true),
    )
    .addStringOption((option) =>
      option
        .setName("time")
        .setDescription("1m 1h 1d | الوقت الذي تريد ازالته")
        .setRequired(true),
    ),
  execute(client, interaction) {
    return __awaiter(this, void 0, void 0, function* () {
      const roles = interaction.member.roles.valueOf();
      const user = interaction.options.get("user");
      const field = interaction.options.get("type");
      const time = interaction.options.get("time");
      const Field = config_json_1.default.options.find(
        (Field) => Field.name == field.value,
      );
      if (
        !(Field === null || Field === void 0
          ? void 0
          : Field?.admins.includes(interaction.user.id))
      )
        return interaction.reply({
          content: "لا يوجد لديك صلاحية",
          ephemeral: true,
        });
      try {
        const parseTime = (0, ms_1.default)(time.value);
        const savedUser = yield client.db.get(
          `${interaction.guild.id},${user.user.id}_${
            field === null || field === void 0 ? void 0 : field.value
          }`,
        );
        if (savedUser) {
          client.db.set(
            `${interaction.guild.id},${user.user.id}_${
              field === null || field === void 0 ? void 0 : field.value
            }`,
            Object.assign(Object.assign({}, savedUser), {
              allTime: savedUser.allTime - parseTime,
            }),
          );
        } else {
          client.db.set(
            `${interaction.guild.id},${user.user.id}_${
              field === null || field === void 0 ? void 0 : field.value
            }`,
            {
              username: user.user.username,
              on: false,
              allTime: parseInt(parseTime),
            },
          );
        }
        yield interaction.reply({
          content: "تم ازالة الوقت بنجاح",
          ephemeral: true,
        });
      } catch (_a) {
        yield interaction.reply({
          content: "خطأ في تنسيق الوقت",
          ephemeral: true,
        });
      }
    });
  },
};
