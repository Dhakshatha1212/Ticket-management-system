import React, { useState } from 'react';
import TicketItem from './TicketItem';

function TicketList({ tickets, loading, onStatusChange, onDelete }) {
  const [filter, setFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter tickets based on status and search query
  const filteredTickets = tickets.filter((ticket) => {
    const matchesStatus = filter === 'All' || ticket.status === filter;
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch = !query || 
      ticket.title.toLowerCase().includes(query) ||
      ticket.description.toLowerCase().includes(query);
    return matchesStatus && matchesSearch;
  });

  // Reset all active filters and search
  const handleResetFilters = () => {
    setFilter('All');
    setSearchQuery('');
  };

  // Loading state
  if (loading) {
    return (
      <div className="card list-state-card">
        <div className="spinner-large"></div>
        <p className="state-text">Loading tickets from database...</p>
      </div>
    );
  }

  return (
    <div className="ticket-list-section">
      {/* Header with Title and Total Count */}
      <div className="ticket-list-header">
        <div className="list-title-group">
          <h2 className="section-title">All Tickets</h2>
          <span className="count-badge">{tickets.length} total</span>
        </div>

        {/* Filter Tabs */}
        <div className="filter-group">
          {['All', 'Open', 'In Progress', 'Closed'].map((tab) => {
            const count = tab === 'All' 
              ? tickets.length 
              : tickets.filter((t) => t.status === tab).length;
            return (
              <button
                key={tab}
                className={`filter-btn ${filter === tab ? 'active' : ''}`}
                onClick={() => setFilter(tab)}
              >
                {tab}
                <span className="tab-count">{count}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Search Bar */}
      <div className="search-bar-wrapper">
        <div className="search-input-container">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            className="search-input"
            placeholder="Search tickets by title or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              className="search-clear-btn"
              onClick={() => setSearchQuery('')}
              title="Clear search"
            >
              ✕
            </button>
          )}
        </div>
        {searchQuery && (
          <p className="search-status-text">
            Found <strong>{filteredTickets.length}</strong> matching "{searchQuery}"
          </p>
        )}
      </div>

      {/* Empty State */}
      {tickets.length === 0 ? (
        <div className="card empty-state-card">
          <div className="empty-icon">🎟️</div>
          <h3 className="empty-title">No tickets yet</h3>
          <p className="empty-description">
            Your ticket queue is completely clear! Use the form to log your first ticket.
          </p>
        </div>
      ) : filteredTickets.length === 0 ? (
        <div className="card empty-state-card">
          <div className="empty-icon">🔎</div>
          <h3 className="empty-title">No matching tickets</h3>
          <p className="empty-description">
            No tickets match your search criteria. Try adjusting your search query or status filter.
          </p>
          <button onClick={handleResetFilters} className="btn-reset-filters">
            Reset Filters & Search
          </button>
        </div>
      ) : (
        /* List / Grid of tickets */
        <div className="tickets-grid">
          {filteredTickets.map((ticket) => (
            <TicketItem
              key={ticket._id}
              ticket={ticket}
              onStatusChange={onStatusChange}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default TicketList;
