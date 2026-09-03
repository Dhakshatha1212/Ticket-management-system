import axios from 'axios';

// Base URL pointing to the Express backend
const API_BASE_URL = 'http://localhost:5000/api/tickets';

// Fetch all tickets
export const fetchTickets = async () => {
  const response = await axios.get(API_BASE_URL);
  return response.data;
};

// Create a new ticket
export const createTicket = async (ticketData) => {
  const response = await axios.post(API_BASE_URL, ticketData);
  return response.data;
};

// Update ticket status or other fields
export const updateTicket = async (id, updatedFields) => {
  const response = await axios.put(`${API_BASE_URL}/${id}`, updatedFields);
  return response.data;
};

// Delete a ticket by ID
export const deleteTicket = async (id) => {
  const response = await axios.delete(`${API_BASE_URL}/${id}`);
  return response.data;
};

