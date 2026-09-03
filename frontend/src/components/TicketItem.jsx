import React, { useState } from 'react';

function TicketItem({ ticket, onStatusChange, onDelete }) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Format creation timestamp cleanly
  const formattedDate = new Date(ticket.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  // Handle status update dropdown change
  const handleStatusSelect = async (e) => {
    const newStatus = e.target.value;
    if (newStatus === ticket.status) return;

    try {
      setIsUpdating(true);
      await onStatusChange(ticket._id, newStatus);
    } catch (err) {
      console.error('Failed to update status:', err);
    } finally {
      setIsUpdating(false);
    }
  };

  // Handle ticket deletion with smooth exit transition
  const handleDeleteClick = async () => {
    const confirmed = window.confirm(`Are you sure you want to delete "${ticket.title}"?`);
    if (!confirmed) return;

    try {
      setIsDeleting(true);
      // Allow the exit transition to play smoothly before unmounting
      setTimeout(async () => {
        try {
          await onDelete(ticket._id);
        } catch (err) {
          console.error('Failed to delete ticket:', err);
          setIsDeleting(false);
        }
      }, 250);
    } catch (err) {
      console.error('Failed to delete ticket:', err);
      setIsDeleting(false);
    }
  };

  // Determine CSS classes for badges
  const statusClass = `status-badge status-${ticket.status.toLowerCase().replace(/\s+/g, '-')}`;
  const priorityClass = `priority-badge priority-${ticket.priority.toLowerCase()}`;

  return (
    <div className={`ticket-card ${isDeleting ? 'card-deleting' : 'card-enter'}`}>
      <div className="ticket-card-header">
        <div className="ticket-badges">
          <span className={statusClass}>
            <span className="badge-dot"></span>
            {ticket.status}
          </span>
          <span className={priorityClass}>
            {ticket.priority} Priority
          </span>
        </div>
        <span className="ticket-date">{formattedDate}</span>
      </div>

      <div className="ticket-card-body">
        <h3 className="ticket-title">{ticket.title}</h3>
        <p className="ticket-description">{ticket.description}</p>
      </div>

      <div className="ticket-card-footer">
        <div className="status-control">
          <label htmlFor={`status-${ticket._id}`} className="control-label">
            Change Status:
          </label>
          <select
            id={`status-${ticket._id}`}
            value={ticket.status}
            onChange={handleStatusSelect}
            disabled={isUpdating || isDeleting}
            className="status-select"
          >
            <option value="Open">Open</option>
            <option value="In Progress">In Progress</option>
            <option value="Closed">Closed</option>
          </select>
          {isUpdating && <span className="spinner-inline"></span>}
        </div>

        <button
          onClick={handleDeleteClick}
          disabled={isDeleting || isUpdating}
          className="btn-delete"
          title="Delete ticket"
        >
          {isDeleting ? 'Deleting...' : 'Delete'}
        </button>
      </div>
    </div>
  );
}

export default TicketItem;
