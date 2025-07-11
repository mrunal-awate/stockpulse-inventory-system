const mongoose = require("mongoose");

const saleSchema = new mongoose.Schema({
  productName: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Sale", saleSchema);
