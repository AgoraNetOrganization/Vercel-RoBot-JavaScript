// © AgoraNet Organization: Telegram - @AgoraNet & @AgoraNet_Chat 
// load all commands in single file

const helpCommand = require("./help");
const evalCommand = require("./eval");
const notesCommand = require("./notes.js");

module.exports = (bot) => {
  helpCommand(bot);
  notesCommand(bot);
  evalCommand(bot);
};