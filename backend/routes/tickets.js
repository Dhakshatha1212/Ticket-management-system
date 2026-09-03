const express = require('express');
const router = express.Router();
const Ticket = require('../models/Ticket');

// ======================================================
// 1. GET /api/tickets - Fetch all tickets
// ======================================================
router.get('/', async (req, res) => {
  try {
    // Retrieve tickets sorted by newest first
    const tickets = await Ticket.find().sort({ createdAt: -1 });
    res.status(200).json(tickets);
  } catch (error) {
    res.status(500).json({ message: 'Server error while fetching tickets', error: error.message });
  }
});

// ======================================================
// 2. GET /api/tickets/:id - Fetch a single ticket by ID
// ======================================================
router.get('/:id', async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);

    // Check if ticket exists
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    res.status(200).json(ticket);
  } catch (error) {
    // Handle invalid ObjectId format
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Invalid ticket ID format' });
    }
    res.status(500).json({ message: 'Server error while fetching ticket', error: error.message });
  }
});

// ======================================================
// 3. POST /api/tickets - Create a new ticket
// ======================================================
router.post('/', async (req, res) => {
  try {
    const { title, description, status, priority } = req.body;

    // Create a new instance of the Ticket model
    const newTicket = new Ticket({
      title,
      description,
      status,
      priority,
    });

    // Save ticket into MongoDB
    const savedTicket = await newTicket.save();
    res.status(201).json(savedTicket);
  } catch (error) {
    // Handle validation errors (e.g., missing required fields)
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Validation Error', error: error.message });
    }
    res.status(500).json({ message: 'Server error while creating ticket', error: error.message });
  }
});

// ======================================================
// 4. PUT /api/tickets/:id - Update an existing ticket
// ======================================================
router.put('/:id', async (req, res) => {
  try {
    // new: true returns updated doc, runValidators: true applies schema validations
    const updatedTicket = await Ticket.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedTicket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    res.status(200).json(updatedTicket);
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Invalid ticket ID format' });
    }
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Validation Error', error: error.message });
    }
    res.status(500).json({ message: 'Server error while updating ticket', error: error.message });
  }
});

// ======================================================
// 5. DELETE /api/tickets/:id - Delete a ticket
// ======================================================
router.delete('/:id', async (req, res) => {
  try {
    const deletedTicket = await Ticket.findByIdAndDelete(req.params.id);

    if (!deletedTicket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    res.status(200).json({ message: 'Ticket deleted successfully', id: req.params.id });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Invalid ticket ID format' });
    }
    res.status(500).json({ message: 'Server error while deleting ticket', error: error.message });
  }
});

module.exports = router;

