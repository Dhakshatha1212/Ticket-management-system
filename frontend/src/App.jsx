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
  
  // Theme state with localStorage persistence
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('ticketflow_theme') === 'dark';
  });

  // Apply dark mode class to root body
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-theme');
      localStorage.setItem('ticketflow_theme', 'dark');
    } else {
      document.body.classList.remove('dark-theme');
      localStorage.setItem('ticketflow_theme', 'light');
    }
  }, [darkMode]);

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
    setTickets((prev) => [created, ...prev]);
    showToast(`Ticket "${created.title}" created successfully!`);
  };

  // Handler: Update full ticket (edit title, description, priority, status)
  const handleEditTicket = async (id, updatedFields) => {
    const updated = await updateTicket(id, updatedFields);
    setTickets((prev) =>
      prev.map((t) => (t._id === id ? updated : t))
    );
    showToast(`Ticket "${updated.title}" updated successfully!`);
  };

  // Handler: Update ticket status only
  const handleStatusChange = async (id, newStatus) => {
    const updated = await updateTicket(id, { status: newStatus });
    setTickets((prev) =>
      prev.map((t) => (t._id === id ? updated : t))
    );
    showToast(`Ticket status changed to "${newStatus}"!`);
  };

  // Handler: Delete ticket
  const handleDeleteTicket = async (id) => {
    await deleteTicket(id);
    setTickets((prev) => prev.filter((t) => t._id !== id));
    showToast('Ticket deleted successfully!');
  };

  // Compute stats for the dashboard header
  const openCount = tickets.filter((t) => t.status === 'Open').length;
  const inProgressCount = tickets.filter((t) => t.status === 'In Progress').length;
  const closedCount = tickets.filter((t) => t.status === 'Closed').length;

  return (
    <div className="app-container">
      {/* Toast Notification with Accessible Live Region */}
      {toastMessage && (
        <div className="toast-notification" role="status" aria-live="polite">
          <span>✨ {toastMessage}</span>
        </div>
      )}

      {/* Top Header Bar */}
      <header className="app-header">
        <div className="header-brand">
          <div className="brand-icon" aria-hidden="true">🎫</div>
          <div>
            <h1 className="brand-title">TicketFlow</h1>
            <p className="brand-tagline">Ticket Management System</p>
          </div>
        </div>

        {/* Right side: Stats and Dark Mode Toggle */}
        <div className="header-actions">
          <div className="header-stats" aria-label="Ticket statistics">
            <div className="stat-pill stat-open">
              <span className="stat-dot" aria-hidden="true"></span>
              <span>Open: <strong>{openCount}</strong></span>
            </div>
            <div className="stat-pill stat-progress">
              <span className="stat-dot" aria-hidden="true"></span>
              <span>In Progress: <strong>{inProgressCount}</strong></span>
            </div>
            <div className="stat-pill stat-closed">
              <span className="stat-dot" aria-hidden="true"></span>
              <span>Closed: <strong>{closedCount}</strong></span>
            </div>
          </div>

          {/* Dark Mode Toggle Button */}
          <button
            onClick={() => setDarkMode((prev) => !prev)}
            className="theme-toggle-btn"
            title={`Switch to ${darkMode ? 'Light' : 'Dark'} Mode`}
            aria-label={`Switch to ${darkMode ? 'Light' : 'Dark'} Mode`}
          >
            {darkMode ? '☀️ Light' : '🌙 Dark'}
          </button>
        </div>
      </header>

      {/* Error Banner */}
      {apiError && (
        <div className="alert alert-error main-error-alert" role="alert">
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
        <section className="form-section" aria-label="Create ticket section">
          <TicketForm onTicketCreated={handleTicketCreated} />
        </section>

        <section className="list-section" aria-label="Tickets list section">
          <TicketList
            tickets={tickets}
            loading={loading}
            onStatusChange={handleStatusChange}
            onDelete={handleDeleteTicket}
            onEdit={handleEditTicket}
          />
        </section>
      </main>
    </div>
  );
}

export default App;
