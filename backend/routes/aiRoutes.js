const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const Sale = require("../models/Sale");
const sendWhatsAppAlert = require("../utils/whatsappNotifier");

// 🧠 AI Insights Route
router.get("/insights", async (req, res) => {
  try {
    const products = await Product.find();
    const sales = await Sale.find();

    const insights = await Promise.all(
      products.map(async (product) => {
        // Filter sales related to current product
        const productSales = sales.filter(
          (sale) => sale.productName === product.name
        );

        const totalSales = productSales.reduce((sum, sale) => sum + sale.quantity, 0);
        const avgDailySales = productSales.length > 0
          ? totalSales / productSales.length
          : 0;

        const forecast7Days = Math.round(avgDailySales * 7);
        const forecast30Days = Math.round(avgDailySales * 30);

        const restockNeeded = product.quantity < product.threshold;

        // 📲 Send WhatsApp Alert if restock needed
        if (restockNeeded) {
          await sendWhatsAppAlert(product.name, product.quantity, forecast7Days);
        }

        return {
          name: product.name,
          quantity: product.quantity,
          threshold: product.threshold,
          averageDailySales: avgDailySales.toFixed(2),
          forecast7Days,
          forecast30Days,
          restockNeeded,
          recommendation: restockNeeded
            ? `⚠️ Restock recommended: only ${product.quantity} left.`
            : "✅ Stock level is healthy.",
        };
      })
    );

    res.json({ insights });
  } catch (err) {
    console.error("Error generating AI insights:", err);
    res.status(500).json({ error: "Failed to generate insights" });
  }
});

module.exports = router;
