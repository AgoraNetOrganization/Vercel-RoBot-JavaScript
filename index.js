// © AgoraNet Organization: Telegram - @AgoraNet & @AgoraNet_Chat 

const { Bot } = require("grammy");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const { setupCommands } = require("./bot/commands");
const express = require("express");

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

// Initialize the bot
const bot = new Bot(process.env.BOT_TOKEN);

// Setup bot commands
setupCommands(bot);

// Start the bot (for normal)
// bot.start();
// console.log("Bot is running...");


// Express server
const app = express();
app.use(express.json()); // Parse incoming JSON payloads

// Bot initialization status
let isBotInitialized = false;

// Initialize the bot and start the server after bot is initialized
(async () => {
  try {
    await bot.init(); // Preload bot metadata
    console.log("Bot initialized successfully:", bot.botInfo.username);
    isBotInitialized = true; // Set initialization flag

    // Set the bot's webhook after initialization
    const webhookUrl = `${process.env.BASE_URL}/api/webhook`;
    await bot.api.setWebhook(webhookUrl);
    console.log(`Webhook set to: ${webhookUrl}`);

    // Start the Express server only after bot is initialized
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (err) {
    console.error("Failed to initialize bot:", err.message);
    process.exit(1); // Stop deployment if initialization fails
  }
})();

// Webhook route (POST)
app.post("/api/webhook", async (req, res) => {
  if (!isBotInitialized) {
      console.error("Webhook received before bot is initialized.");
      return res.sendStatus(503); // Service unavailable
  }

  const update = req.body;

  // Only process message updates
  if (update.message) {
      try {
          await bot.handleUpdate(update); // Process the message
          res.sendStatus(200); // Acknowledge Telegram immediately
      } catch (err) {
          console.error("Error handling message update:", err.message);
          res.sendStatus(500); // Internal server error
      }
  } else {
      // console.log("Ignoring non-message update:", JSON.stringify(update, null, 2));
      res.sendStatus(200); // Acknowledge non-message updates
  }
});


// Debugging endpoint (GET)
app.get("/api/webhook", (req, res) => {
  res.status(200).send("Webhook is working! But this endpoint only accepts POST requests. Telegram: @AgoraNet");
});