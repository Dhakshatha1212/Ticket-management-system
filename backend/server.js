const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

// Import routes
const ticketRoutes = require('./routes/tickets');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Root health check route
app.get('/', (req, res) => {
  res.send('Ticket Management Backend is running!');
});

// Ticket API routes
app.use('/api/tickets', ticketRoutes);

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch((err) => console.log('❌ MongoDB Connection Error:', err));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});