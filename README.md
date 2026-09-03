# 🎫 TicketFlow — Ticket Management System

TicketFlow is a full-stack **MERN (MongoDB, Express, React, Node.js)** ticket management application designed to help teams track, organize, and resolve issues and requests efficiently.

---

## ✨ Features

- **Full CRUD Operations**: Create, read, edit, and delete support tickets seamlessly.
- **Real-Time Search**: Search bar to filter tickets by title instantly.
- **Status & Priority Filtering**: Filter tickets by status (*All*, *Open*, *In Progress*, *Closed*) with live counts and color-coded badges.
- **Multi-Field Sorting**: Sort tickets by Newest, Oldest, Priority (High → Low, Low → High), or Title (A → Z).
- **Inline Editing & Quick Status**: Update ticket status directly from the card dropdown or open the inline editor to modify title, description, priority, and status.
- **Smooth Animations**: Subtle entry and exit transitions when adding or deleting tickets.
- **Dark Mode Support**: One-click toggle between light and dark themes with persistent preference stored in `localStorage`.
- **Fully Responsive**: Optimized for desktop, tablet, and mobile screens down to 360px viewports.
- **Feedback & Notifications**: Accessible toast alerts for user actions and connection error recovery banners.

---

## 🛠️ Tech Stack

### Frontend
- **React 18** (Vite)
- **CSS3** (CSS Custom Properties, Flexbox, CSS Grid, Transitions/Keyframes)
- **Axios** (HTTP client for REST API communication)

### Backend
- **Node.js**
- **Express.js** (REST API framework)
- **Mongoose** (MongoDB object modeling)
- **CORS** (Cross-Origin Resource Sharing)
- **dotenv** (Environment variable management)

### Database
- **MongoDB Atlas** (Cloud Database) or Local MongoDB

---

## 📁 Folder Structure

```
ticket-management-system/
├── backend/
│   ├── models/
│   │   └── Ticket.js          # Mongoose schema for tickets
│   ├── routes/
│   │   └── tickets.js         # Express CRUD route handlers (/api/tickets)
│   ├── .env.example           # Example environment configuration template
│   ├── .gitignore             # Backend gitignore (node_modules, .env, dist)
│   ├── package.json           # Backend dependencies and scripts
│   └── server.js              # Express app entry point & MongoDB connection
│
├── frontend/
│   ├── public/
│   │   └── favicon.svg        # Custom TicketFlow SVG favicon
│   ├── src/
│   │   ├── components/
│   │   │   ├── TicketForm.jsx # Ticket creation form component
│   │   │   ├── TicketItem.jsx # Single ticket card with inline edit & delete
│   │   │   └── TicketList.jsx # Filter, search, sort toolbar & ticket list
│   │   ├── App.css            # Component styles, themes, and animations
│   │   ├── App.jsx            # Main app state, handlers, header, and layout
│   │   ├── api.js             # Axios API service methods
│   │   ├── index.css          # Base resets and CSS variable tokens
│   │   └── main.jsx           # React DOM root render
│   ├── index.html             # HTML entry point with title & favicon
│   ├── .gitignore             # Frontend gitignore (node_modules, dist, .env)
│   ├── package.json           # Frontend dependencies and scripts
│   └── vite.config.js         # Vite configuration
│
├── .gitignore                 # Root gitignore protecting all secrets & dependencies
└── README.md                  # Project documentation
```

---

## 🚀 Getting Started (Local Setup)

### Prerequisites
Make sure you have the following installed on your machine:
- **Node.js** (v18.x or higher recommended)
- **npm** (comes bundled with Node.js)
- A **MongoDB Atlas** database connection string (or a local MongoDB instance running on `mongodb://localhost:27017`)

---

### 1. Backend Setup

1. Open a terminal and navigate to the `backend` directory:
   ```bash
   cd backend
   ```

2. Install backend dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the `backend/` root directory:
   ```bash
   # You can copy the example file:
   cp .env.example .env
   ```

4. Open `.env` and set your MongoDB connection string and port:
   ```env
   MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/ticketDB?retryWrites=true&w=majority
   PORT=5000
   ```
   > Replace `<username>`, `<password>`, and `<cluster>` with your actual MongoDB Atlas credentials.

5. Start the backend server:
   ```bash
   node server.js
   ```
   > You should see:
   > ```
   > Server is running on http://localhost:5000
   > ✅ MongoDB Connected
   > ```

---

### 2. Frontend Setup

1. Open a second terminal and navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```

2. Install frontend dependencies:
   ```bash
   npm install
   ```

3. Start the Vite development server:
   ```bash
   npm run dev
   ```

4. Open your browser and visit:
   ```
   http://localhost:5173
   ```

---

## 📡 API Reference

Base URL: `http://localhost:5000/api/tickets`

| Method | Endpoint | Description | Request Body |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/tickets` | Retrieve all tickets (sorted newest first) | None |
| `GET` | `/api/tickets/:id` | Retrieve a single ticket by MongoDB ID | None |
| `POST` | `/api/tickets` | Create a new ticket | `{ title, description, priority, status? }` |
| `PUT` | `/api/tickets/:id` | Update ticket details or status | `{ title?, description?, priority?, status? }` |
| `DELETE` | `/api/tickets/:id` | Delete a ticket by ID | None |

---

## 🔒 Security & Git Configuration

Sensitive environment variables (`.env`) and installed package dependencies (`node_modules/`, `dist/`) are excluded from version control via `.gitignore` files in both root, `/backend`, and `/frontend`.

To verify ignored files locally:
```bash
git check-ignore backend/.env backend/node_modules frontend/node_modules frontend/dist
```

---

## 📄 License
This project is open source and available under the [MIT License](LICENSE).