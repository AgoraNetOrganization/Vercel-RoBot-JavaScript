// © AgoraNet Organization: Telegram - @AgoraNet & @AgoraNet_Chat 

const mongoose = require("mongoose");

const textSchema = new mongoose.Schema({
  userId: { type: Number, required: true },
  text: { type: String, required: true },
});

module.exports = mongoose.model("Text", textSchema);
