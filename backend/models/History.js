const mongoose = require("mongoose");

const historySchema = new mongoose.Schema(
  {
    action: { type: String, required: true }, // e.g., "ADD", "SELL", "UPDATE", "DELETE"
    productName: { type: String, required: true },
    quantity: { type: Number },
    timestamp: { type: Date, default: Date.now },
    description: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("History", historySchema);
