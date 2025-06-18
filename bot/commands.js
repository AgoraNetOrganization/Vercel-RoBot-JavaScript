// © AgoraNet Organization: Telegram - @AgoraNet & @AgoraNet_Chat 

const loadCommands = require("./commands/index");

const setupCommands = (bot) => {
  loadCommands(bot);
};

module.exports = { setupCommands };