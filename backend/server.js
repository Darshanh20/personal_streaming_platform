const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// Routes
app.get('/api/health', (req, res) => {
  res.json({ message: 'Backend is running!' });
});

// Test route to fetch data
app.get('/api/data', (req, res) => {
  res.json({ 
    data: 'Sample data from backend',
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
