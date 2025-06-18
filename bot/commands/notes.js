

const Text = require("../../models/text");

module.exports = (bot) => {
  bot.command("add", async (ctx) => {
        const textToAdd = ctx.message.text.split(" ").slice(1).join(" ");
        if (!textToAdd) {
          return ctx.reply("Please provide text to add. Usage: /add <your text>");
        }
    
        try {
          const newText = new Text({ userId: ctx.from.id, text: textToAdd });
          const savedText = await newText.save();
    
          // Respond with the unique ID of the added text
          ctx.reply(`Text added successfully!\n\nID: ${savedText._id}`);
        } catch (err) {
          console.error(err);
          ctx.reply("An error occurred while adding the text. Please try again.");
        }
      });

  bot.command("edit", async (ctx) => {
    const [id, ...newTextArr] = ctx.message.text.split(" ").slice(1);
    const newText = newTextArr.join(" ");
    if (!id || !newText) {
      return ctx.reply("Please provide an ID and new text. Usage: /edit <id> <new text>");
    }

    const updatedText = await Text.findOneAndUpdate(
      { _id: id, userId: ctx.from.id },
      { text: newText },
      { new: true }
    );

    if (!updatedText) {
      return ctx.reply("No text found with the given ID, or you don't have permission to edit it.");
    }

    ctx.reply("Text updated successfully!");
  });

  bot.command("delete", async (ctx) => {
    const id = ctx.message.text.split(" ")[1];

    if (!id) {
      return ctx.reply("Please provide the ID of the text to delete. Usage: /delete <id>");
    }

    const deletedText = await Text.findOneAndDelete({ _id: id, userId: ctx.from.id });

    if (!deletedText) {
      return ctx.reply("No text found with the given ID, or you don't have permission to delete it.");
    }

    ctx.reply("Text deleted successfully!");
  });

  bot.command("show", async (ctx) => {
    const userTexts = await Text.find({ userId: ctx.from.id });

    if (userTexts.length === 0) {
      return ctx.reply("No texts found.");
    }

    const response = userTexts
      .map((text, index) => `${index + 1}. ID: ${text._id}\nText: ${text.text}`)
      .join("\n\n");

    ctx.reply(response);
  });

  bot.command("count", async (ctx) => {
    const count = await Text.countDocuments({ userId: ctx.from.id });

    ctx.reply(`You have saved ${count} text(s).`);
  });
};