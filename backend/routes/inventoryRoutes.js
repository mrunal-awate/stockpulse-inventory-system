const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const History = require('../models/History');
const Sale = require('../models/Sale');
const { sendWhatsappMessage } = require("../utils/whatsappNotifier"); // ✅ NEW

// ✅ Add new product or update existing
router.post('/add', async (req, res) => {
  try {
    const name = req.body.name.trim().toLowerCase();
    const quantity = parseInt(req.body.quantity);
    const threshold = parseInt(req.body.threshold);

    let product = await Product.findOne({ name });

    if (product) {
      product.quantity += quantity;
      product.threshold = threshold;
      product.notified = false; // 🔄 Reset notification on restock
      await product.save();

      await History.create({
        action: "ADD",
        productName: product.name,
        quantity,
        description: `Updated quantity of "${product.name}" by +${quantity}`
      });

      return res.status(200).json({
        message: `✅ Product "${product.name}" updated successfully`,
        product,
      });
    }

    const newProduct = new Product({ name, quantity, threshold, notified: false }); // 🔄
    await newProduct.save();

    await History.create({
      action: "ADD",
      productName: newProduct.name,
      quantity,
      description: `New product "${newProduct.name}" added with quantity ${quantity}`
    });

    res.status(201).json({
      message: `🆕 Product "${newProduct.name}" added successfully`,
      product: newProduct,
    });
  } catch (err) {
    console.error("Error adding/updating product:", err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ Sell product (reduce quantity + log sale)
router.post('/sell', async (req, res) => {
  try {
    const name = req.body.name.trim().toLowerCase();
    const quantity = parseInt(req.body.quantity);

    const product = await Product.findOne({ name });
    if (!product) return res.status(404).json({ error: 'Product not found' });

    product.quantity -= quantity;
    if (product.quantity < 0) product.quantity = 0;

    // 📲 Send WhatsApp only once
    if (product.quantity < product.threshold && !product.notified) {
      await sendWhatsappMessage(`⚠️ Low stock alert for "${product.name}" – only ${product.quantity} left!`);
      product.notified = false;
    }

    await product.save();

    // ✅ Log in History
    await History.create({
      action: "SELL",
      productName: product.name,
      quantity,
      description: `Sold ${quantity} of "${product.name}". Remaining: ${product.quantity}`
    });

    // ✅ Log in Sale for AI
    await Sale.create({
      productName: product.name,
      quantity,
      soldAt: new Date()
    });

    const alert = product.quantity < product.threshold
      ? `⚠️ Low stock alert: ${product.name} has only ${product.quantity} left.`
      : null;

    res.json({ product, alert });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Get all products
router.get('/all', async (req, res) => {
  try {
    const products = await Product.find().sort({ updatedAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Update product by ID
router.put('/update/:id', async (req, res) => {
  try {
    const { name, quantity, threshold } = req.body;

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        name: name.trim().toLowerCase(),
        quantity: parseInt(quantity),
        threshold: parseInt(threshold),
        notified: false // 🔄 Reset notified flag on update
      },
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ error: "Product not found" });
    }

    await History.create({
      action: "UPDATE",
      productName: updatedProduct.name,
      quantity: updatedProduct.quantity,
      description: `Updated "${updatedProduct.name}" via edit`
    });

    res.json({ message: "✅ Product updated successfully", product: updatedProduct });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Delete product by ID
router.delete('/delete/:id', async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) {
      return res.status(404).json({ error: "Product not found" });
    }

    await History.create({
      action: "DELETE",
      productName: deletedProduct.name,
      quantity: deletedProduct.quantity,
      description: `Deleted product "${deletedProduct.name}"`
    });

    res.json({ message: "🗑️ Product deleted successfully", product: deletedProduct });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
