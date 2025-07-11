const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const inventoryRoutes = require('./routes/inventoryRoutes');
const historyRoutes = require('./routes/historyRoutes');
const aiRoutes = require("./routes/aiRoutes");



const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/stockpulse', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('✅ MongoDB Connected');
}).catch((err) => {
  console.error('❌ MongoDB Error:', err);
});

// Root Route (optional, for confirmation)
app.get('/', (req, res) => {
  res.send('🎉 Welcome to StockPulse Inventory API!');
});

// Inventory Routes
app.use('/api/inventory', inventoryRoutes);
app.use('/api/history', historyRoutes);
app.use("/api/ai", aiRoutes);


// 404 fallback
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
