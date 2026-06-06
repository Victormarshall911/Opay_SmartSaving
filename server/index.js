const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const geminiRoutes = require('./routes/gemini');
const uploadRoutes = require('./routes/upload');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// API routes
app.use('/api/gemini', geminiRoutes);
app.use('/api', uploadRoutes);

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist/index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`🚀 OPay Smart Savings Server running on port ${PORT}`);
});
