const mongoose = require("mongoose");

const cardSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  imageUrl: { type: String },
  status: { type: String },
});

module.exports = mongoose.model("cards", cardSchema);
