const express = require('express');
const router = express.Router();
const History = require('../models/History');

// GET all history logs
router.get('/', async (req, res) => {
  try {
    const logs = await History.find().sort({ createdAt: -1 });
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
