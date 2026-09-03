import React, { useState, useEffect } from 'react';
import { fetchTickets, createTicket, updateTicket, deleteTicket } from './api';
import TicketForm from './components/TicketForm';
import TicketList from './components/TicketList';
import './App.css';

function App() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  // Helper to show temporary notification toasts
  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Load tickets on initial mount
  useEffect(() => {
    loadTickets();
  }, []);

  const loadTickets = async () => {
    try {
      setLoading(true);
      setApiError(null);
      const data = await fetchTickets();
      setTickets(data);
    } catch (err) {
      console.error('Error fetching tickets:', err);
      setApiError(
        'Unable to connect to the backend server. Please make sure the backend is running on http://localhost:5000'
      );
    } finally {
      setLoading(false);
    }
  };

  // Handler: Create ticket
  const handleTicketCreated = async (ticketData) => {
    const created = await createTicket(ticketData);
    // Prepend newly created ticket to the top of the list
    setTickets((prev) => [created, ...prev]);
    showToast(`Ticket "${created.title}" created successfully!`);
  };

  // Handler: Update ticket status
  const handleStatusChange = async (id, newStatus) => {
    const updated = await updateTicket(id, { status: newStatus });
    setTickets((prev) =>
      prev.map((t) => (t._id === id ? updated : t))
    );
    showToast(`Status updated to "${newStatus}"`);
  };

  // Handler: Delete ticket
  const handleDeleteTicket = async (id) => {
    await deleteTicket(id);
    setTickets((prev) => prev.filter((t) => t._id !== id));
    showToast('Ticket deleted successfully');
  };

  // Compute stats for the dashboard header
  const openCount = tickets.filter((t) => t.status === 'Open').length;
  const inProgressCount = tickets.filter((t) => t.status === 'In Progress').length;
  const closedCount = tickets.filter((t) => t.status === 'Closed').length;

  return (
    <div className="app-container">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="toast-notification">
          <span>✨ {toastMessage}</span>
        </div>
      )}

      {/* Top Navigation Bar */}
      <header className="app-header">
        <div className="header-brand">
          <div className="brand-icon">🎫</div>
          <div>
            <h1 className="brand-title">TicketFlow</h1>
            <p className="brand-tagline">Ticket Management System</p>
          </div>
        </div>

        {/* Quick Summary Badges */}
        <div className="header-stats">
          <div className="stat-pill stat-open">
            <span className="stat-dot"></span>
            <span>Open: <strong>{openCount}</strong></span>
          </div>
          <div className="stat-pill stat-progress">
            <span className="stat-dot"></span>
            <span>In Progress: <strong>{inProgressCount}</strong></span>
          </div>
          <div className="stat-pill stat-closed">
            <span className="stat-dot"></span>
            <span>Closed: <strong>{closedCount}</strong></span>
          </div>
        </div>
      </header>

      {/* Error alert banner */}
      {apiError && (
        <div className="alert alert-error main-error-alert">
          <div className="alert-content">
            <strong>Connection Notice:</strong> {apiError}
          </div>
          <button onClick={loadTickets} className="btn-retry">
            Retry Connection
          </button>
        </div>
      )}

      {/* Main Content Area */}
      <main className="main-content">
        <section className="form-section">
          <TicketForm onTicketCreated={handleTicketCreated} />
        </section>

        <section className="list-section">
          <TicketList
            tickets={tickets}
            loading={loading}
            onStatusChange={handleStatusChange}
            onDelete={handleDeleteTicket}
          />
        </section>
      </main>
    </div>
  );
}

export default App;
