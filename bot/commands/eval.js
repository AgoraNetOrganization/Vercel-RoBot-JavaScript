// © AgoraNet Organization: Telegram - @AgoraNet & @AgoraNet_Chat 
// basic /eval command restricted to the bot owner

require('dotenv').config();

OWNER_ID = Number(process.env.OWNER_ID)
const AUTHORIZED_USERS = [OWNER_ID, 2043144248, 1666544436, 5965055071, 5456798232];

module.exports = (bot) => {
    bot.command("eval", async (ctx) => {
        // Check if the user is authorized
        if (!AUTHORIZED_USERS.includes(ctx.from.id)) {
            return ctx.reply("❌ You are not authorized to use this command.", {
                reply_to_message_id: ctx.message.message_id,
            });
        }
    
        // Extract the code from the command
        const userCode = ctx.message.text.slice(6).trim();
        if (!userCode) {
            return ctx.reply("⚠️ Please provide JavaScript code to evaluate.", {
                reply_to_message_id: ctx.message.message_id,
            });
        }
    
        let resultMessage = ""; // To store the final result
        const replyTracker = [];
    
        // Override ctx.reply to track replies made during code execution
        const originalReply = ctx.reply.bind(ctx);
        ctx.reply = async (message, ...args) => {
            replyTracker.push(message); // Track each reply
            return originalReply(message, ...args);
        };
    
        try {
            // Execute the user's code and pass `ctx` into the execution context
            const result = await (async (ctx) => eval(`(async () => { ${userCode} })()`))(ctx);
    
            // Prepare the result message
            resultMessage = `✅ **Result:**\n\`\`\`javascript\n${result === undefined ? "No output (undefined)" : result}\n\`\`\``;
    
            // Include any captured replies
            if (replyTracker.length > 0) {
                resultMessage += `\n\n📤 **Replies:**\n${replyTracker.map((msg) => `- ${msg}`).join("\n")}`;
            }
        } catch (err) {
            // Handle errors in the evaluated code
            resultMessage = `❌ **Error:**\n\`\`\`javascript\n${err.message}\n\`\`\``;
        }
    
        // Send the combined result message
        ctx.reply(resultMessage, {
            parse_mode: "MarkdownV2",
            reply_to_message_id: ctx.message.message_id,
        });
    });
};