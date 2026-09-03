import React, { useState } from 'react';

function TicketItem({ ticket, onStatusChange, onDelete, onEdit }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(ticket.title);
  const [editDescription, setEditDescription] = useState(ticket.description);
  const [editPriority, setEditPriority] = useState(ticket.priority);
  const [editStatus, setEditStatus] = useState(ticket.status);
  
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [editError, setEditError] = useState('');

  // Format creation timestamp cleanly
  const formattedDate = new Date(ticket.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  // Handle quick status dropdown change
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

  // Handle saving the full edit form
  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editTitle.trim() || !editDescription.trim()) {
      setEditError('Title and description cannot be empty.');
      return;
    }

    try {
      setIsUpdating(true);
      setEditError('');
      await onEdit(ticket._id, {
        title: editTitle.trim(),
        description: editDescription.trim(),
        priority: editPriority,
        status: editStatus,
      });
      setIsEditing(false);
    } catch (err) {
      setEditError(err.response?.data?.message || 'Failed to update ticket.');
    } finally {
      setIsUpdating(false);
    }
  };

  // Cancel edit mode and reset to existing ticket data
  const handleCancelEdit = () => {
    setEditTitle(ticket.title);
    setEditDescription(ticket.description);
    setEditPriority(ticket.priority);
    setEditStatus(ticket.status);
    setEditError('');
    setIsEditing(false);
  };

  // Handle ticket deletion with exit animation
  const handleDeleteClick = async () => {
    const confirmed = window.confirm(`Are you sure you want to delete "${ticket.title}"?`);
    if (!confirmed) return;

    try {
      setIsDeleting(true);
      setTimeout(async () => {
        try {
          await onDelete(ticket._id);
        } catch (err) {
          console.error('Failed to delete ticket:', err);
          setIsDeleting(false);
        }
      }, 280);
    } catch (err) {
      console.error('Failed to delete ticket:', err);
      setIsDeleting(false);
    }
  };

  // Badge CSS classes
  const statusClass = `status-badge status-${ticket.status.toLowerCase().replace(/\s+/g, '-')}`;
  const priorityClass = `priority-badge priority-${ticket.priority.toLowerCase()}`;

  // If in Edit Mode, render the edit form
  if (isEditing) {
    return (
      <div className="ticket-card edit-card-active card-enter">
        <form onSubmit={handleSaveEdit} className="ticket-edit-form">
          <div className="edit-form-header">
            <h4 className="edit-form-title">✏️ Edit Ticket</h4>
            <span className="ticket-date">{formattedDate}</span>
          </div>

          {editError && <div className="alert alert-error">{editError}</div>}

          <div className="form-group">
            <label htmlFor={`edit-title-${ticket._id}`} className="form-label">
              Title
            </label>
            <input
              id={`edit-title-${ticket._id}`}
              type="text"
              className="form-input"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              disabled={isUpdating}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor={`edit-desc-${ticket._id}`} className="form-label">
              Description
            </label>
            <textarea
              id={`edit-desc-${ticket._id}`}
              className="form-textarea"
              rows="3"
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              disabled={isUpdating}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group flex-1">
              <label htmlFor={`edit-priority-${ticket._id}`} className="form-label">
                Priority
              </label>
              <select
                id={`edit-priority-${ticket._id}`}
                className="form-select"
                value={editPriority}
                onChange={(e) => setEditPriority(e.target.value)}
                disabled={isUpdating}
              >
                <option value="Low">Low Priority</option>
                <option value="Medium">Medium Priority</option>
                <option value="High">High Priority</option>
              </select>
            </div>

            <div className="form-group flex-1">
              <label htmlFor={`edit-status-${ticket._id}`} className="form-label">
                Status
              </label>
              <select
                id={`edit-status-${ticket._id}`}
                className="form-select"
                value={editStatus}
                onChange={(e) => setEditStatus(e.target.value)}
                disabled={isUpdating}
              >
                <option value="Open">Open</option>
                <option value="In Progress">In Progress</option>
                <option value="Closed">Closed</option>
              </select>
            </div>
          </div>

          <div className="edit-actions-row">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleCancelEdit}
              disabled={isUpdating}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary btn-save-edit"
              disabled={isUpdating}
            >
              {isUpdating ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    );
  }

  // Standard Card View
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
            Status:
          </label>
          <select
            id={`status-${ticket._id}`}
            aria-label="Change ticket status"
            value={ticket.status}
            onChange={handleStatusSelect}
            disabled={isUpdating || isDeleting}
            className="status-select"
          >
            <option value="Open">Open</option>
            <option value="In Progress">In Progress</option>
            <option value="Closed">Closed</option>
          </select>
          {isUpdating && <span className="spinner-inline" aria-hidden="true"></span>}
        </div>

        <div className="card-actions-group">
          <button
            onClick={() => setIsEditing(true)}
            disabled={isDeleting || isUpdating}
            className="btn-action btn-edit"
            title="Edit ticket title and description"
            aria-label={`Edit ticket ${ticket.title}`}
          >
            ✏️ Edit
          </button>
          <button
            onClick={handleDeleteClick}
            disabled={isDeleting || isUpdating}
            className="btn-action btn-delete"
            title="Delete ticket"
            aria-label={`Delete ticket ${ticket.title}`}
          >
            {isDeleting ? 'Deleting...' : '🗑️ Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default TicketItem;
