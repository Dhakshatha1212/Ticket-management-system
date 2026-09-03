import React, { useState } from 'react';
import TicketItem from './TicketItem';

function TicketList({ tickets, loading, onStatusChange, onDelete, onEdit }) {
  const [filter, setFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  // Priority ranking for sorting
  const priorityRank = {
    High: 3,
    Medium: 2,
    Low: 1,
  };

  // Filter tickets by status and title search query
  const filteredTickets = tickets.filter((ticket) => {
    const matchesStatus = filter === 'All' || ticket.status === filter;
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch = !query || ticket.title.toLowerCase().includes(query);
    return matchesStatus && matchesSearch;
  });

  // Sort filtered tickets
  const sortedTickets = [...filteredTickets].sort((a, b) => {
    if (sortBy === 'newest') {
      return new Date(b.createdAt) - new Date(a.createdAt);
    }
    if (sortBy === 'oldest') {
      return new Date(a.createdAt) - new Date(b.createdAt);
    }
    if (sortBy === 'priority-desc') {
      return (priorityRank[b.priority] || 0) - (priorityRank[a.priority] || 0);
    }
    if (sortBy === 'priority-asc') {
      return (priorityRank[a.priority] || 0) - (priorityRank[b.priority] || 0);
    }
    if (sortBy === 'title-asc') {
      return a.title.localeCompare(b.title);
    }
    return 0;
  });

  // Reset filters and search
  const handleResetFilters = () => {
    setFilter('All');
    setSearchQuery('');
    setSortBy('newest');
  };

  // Loading state
  if (loading) {
    return (
      <div className="card list-state-card" role="status" aria-live="polite">
        <div className="spinner-large"></div>
        <p className="state-text">Loading tickets from database...</p>
      </div>
    );
  }

  return (
    <div className="ticket-list-section">
      {/* List Header with Title and Total Count */}
      <div className="ticket-list-header">
        <div className="list-title-group">
          <h2 className="section-title">All Tickets</h2>
          <span className="count-badge" aria-label={`${tickets.length} total tickets`}>
            {tickets.length} total
          </span>
        </div>

        {/* Status Filter Tabs */}
        <div className="filter-group" role="tablist" aria-label="Ticket status filters">
          {['All', 'Open', 'In Progress', 'Closed'].map((tab) => {
            const count = tab === 'All' 
              ? tickets.length 
              : tickets.filter((t) => t.status === tab).length;
            return (
              <button
                key={tab}
                role="tab"
                aria-selected={filter === tab}
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

      {/* Search and Sort Toolbar */}
      <div className="list-toolbar">
        {/* Search Input */}
        <div className="search-input-container">
          <span className="search-icon" aria-hidden="true">🔍</span>
          <input
            type="text"
            className="search-input"
            aria-label="Search tickets by title"
            placeholder="Search tickets by title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              type="button"
              className="search-clear-btn"
              onClick={() => setSearchQuery('')}
              title="Clear search input"
              aria-label="Clear search input"
            >
              ✕
            </button>
          )}
        </div>

        {/* Sort Select */}
        <div className="sort-container">
          <label htmlFor="sort-select" className="sort-label">
            Sort:
          </label>
          <select
            id="sort-select"
            className="sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            aria-label="Sort tickets by"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="priority-desc">Priority: High → Low</option>
            <option value="priority-asc">Priority: Low → High</option>
            <option value="title-asc">Title: A → Z</option>
          </select>
        </div>
      </div>

      {/* Active Search & Filter Feedback Banner */}
      {(searchQuery || filter !== 'All') && tickets.length > 0 && (
        <div className="filter-feedback-bar">
          <span>
            Showing <strong>{sortedTickets.length}</strong> of <strong>{tickets.length}</strong> tickets
            {searchQuery && <> with title matching "<em>{searchQuery}</em>"</>}
            {filter !== 'All' && <> in status <strong>{filter}</strong></>}
          </span>
          <button onClick={handleResetFilters} className="link-reset-filters">
            Reset
          </button>
        </div>
      )}

      {/* Empty States */}
      {tickets.length === 0 ? (
        <div className="card empty-state-card">
          <div className="empty-icon" aria-hidden="true">🎟️</div>
          <h3 className="empty-title">No tickets yet</h3>
          <p className="empty-description">
            Your ticket queue is completely clear! Use the form on the left to create your first ticket.
          </p>
        </div>
      ) : sortedTickets.length === 0 ? (
        <div className="card empty-state-card">
          <div className="empty-icon" aria-hidden="true">🔎</div>
          <h3 className="empty-title">No matching tickets found</h3>
          <p className="empty-description">
            {searchQuery 
              ? `No tickets found with title matching "${searchQuery}"${filter !== 'All' ? ` in status "${filter}"` : ''}.`
              : `There are currently no tickets marked as "${filter}".`}
          </p>
          <button onClick={handleResetFilters} className="btn-reset-filters">
            Clear Search & Filters
          </button>
        </div>
      ) : (
        /* List / Grid of tickets */
        <div className="tickets-grid">
          {sortedTickets.map((ticket) => (
            <TicketItem
              key={ticket._id}
              ticket={ticket}
              onStatusChange={onStatusChange}
              onDelete={onDelete}
              onEdit={onEdit}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default TicketList;
