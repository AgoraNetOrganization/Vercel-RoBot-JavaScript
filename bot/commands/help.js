// © AgoraNet Organization: Telegram - @AgoraNet & @AgoraNet_Chat 
// basic /help command to get list of all commands


module.exports = (bot) => {
    bot.command("help", (ctx) => {
      const helpText = `
  Available Commands:
  /add <text> - Add new text
  /edit <id> <new text> - Edit existing text by ID
  /delete <id> - Delete text by ID
  /show - Show all saved texts
  /count - Show the count of your saved texts
  /help - Display this help message
  `;
      ctx.reply(helpText);
    });
  };