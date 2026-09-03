import React, { useState } from 'react';

function TicketForm({ onTicketCreated }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic client-side validation
    if (!title.trim() || !description.trim()) {
      setErrorMessage('Please fill in both title and description.');
      return;
    }

    try {
      setSubmitting(true);
      setErrorMessage('');

      await onTicketCreated({
        title: title.trim(),
        description: description.trim(),
        priority,
      });

      // Clear form inputs on success
      setTitle('');
      setDescription('');
      setPriority('Medium');
    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'Failed to create ticket. Please check backend connection.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="card ticket-form-card">
      <div className="card-header">
        <h2 className="card-title">Create New Ticket</h2>
        <p className="card-subtitle">Fill in the details below to log an issue or request.</p>
      </div>

      {errorMessage && <div className="alert alert-error">{errorMessage}</div>}

      <form onSubmit={handleSubmit} className="ticket-form">
        <div className="form-group">
          <label htmlFor="ticket-title" className="form-label">
            Ticket Title <span className="required-star">*</span>
          </label>
          <input
            id="ticket-title"
            type="text"
            className="form-input"
            placeholder="e.g., Fix login page button responsiveness"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={submitting}
          />
        </div>

        <div className="form-group">
          <label htmlFor="ticket-desc" className="form-label">
            Description <span className="required-star">*</span>
          </label>
          <textarea
            id="ticket-desc"
            className="form-textarea"
            rows="3"
            placeholder="Provide relevant details, steps to reproduce, or expectations..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={submitting}
          />
        </div>

        <div className="form-row">
          <div className="form-group flex-1">
            <label htmlFor="ticket-priority" className="form-label">
              Priority
            </label>
            <select
              id="ticket-priority"
              className="form-select"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              disabled={submitting}
            >
              <option value="Low">Low Priority</option>
              <option value="Medium">Medium Priority</option>
              <option value="High">High Priority</option>
            </select>
          </div>

          <div className="form-group form-submit-container">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={submitting}
            >
              {submitting ? 'Creating...' : '+ Create Ticket'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default TicketForm;

