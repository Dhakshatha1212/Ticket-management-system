const mongoose = require('mongoose');

// Ticket Schema Definition
const ticketSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Ticket title is required'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Ticket description is required'],
    trim: true,
  },
  status: {
    type: String,
    enum: ['Open', 'In Progress', 'Closed'],
    default: 'Open',
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
    default: 'Medium',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Export Ticket model for use in routes
module.exports = mongoose.model('Ticket', ticketSchema);

