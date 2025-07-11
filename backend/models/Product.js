const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    unique: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  threshold: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    default: 'Uncategorized',
    trim: true,
  },
  supplier: {
    type: String,
    default: 'Unknown Supplier',
    trim: true,
  },
  notified: {
  type: Boolean,
  default: false,
},

}, { timestamps: true });

productSchema.index({ name: 1 }, { unique: true });

module.exports = mongoose.model('Product', productSchema);
