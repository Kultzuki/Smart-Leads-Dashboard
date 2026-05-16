# Smart Leads Dashboard

A full-stack **Lead Management Dashboard** built with the **MERN stack** (MongoDB, Express.js, React, Node.js) and **TypeScript** throughout.

## Features

- **JWT Authentication** — Register, login, protected routes, bcrypt password hashing
- **Leads CRUD** — Create, Read, Update, Delete leads with full form validation
- **Advanced Filtering** — Filter by status, source, search by name/email; all filters combinable
- **Debounced Search** — 500ms debounce to reduce API calls
- **Backend Pagination** — 10 records per page with pagination metadata
- **CSV Export** — Admin-only export of filtered leads
- **Role-Based Access Control** — Admin and Sales User roles with different permissions
- **Responsive UI** — TailwindCSS dark-mode design, works on all screen sizes
- **Docker Support** — Full Docker + Docker Compose setup

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, TypeScript, Vite, TailwindCSS, Zustand, React Hook Form |
| Backend | Node.js, Express.js, TypeScript, Mongoose |
| Database | MongoDB (Atlas) |
| Auth | JWT + bcryptjs |
| Containerization | Docker + Docker Compose |

---

## Project Structure

```
smart-leads-dashboard/
├── backend/
│   ├── src/
│   │   ├── controllers/     # Route handlers
│   │   ├── middleware/      # Auth middleware (protect, restrictTo)
│   │   ├── models/          # Mongoose models (User, Lead)
│   │   ├── routes/          # Express routers
│   │   ├── types/           # TypeScript interfaces
│   │   └── server.ts        # Entry point
│   ├── .env.example
│   ├── Dockerfile
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── api/             # Axios instance + API functions
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # Route-level pages
│   │   ├── store/           # Zustand state stores
│   │   ├── types/           # TypeScript interfaces
│   │   └── App.tsx
│   ├── Dockerfile
│   ├── nginx.conf
│   └── package.json
├── docker-compose.yml
└── README.md
```

---

## Getting Started

### Prerequisites

- Node.js 20+
- MongoDB Atlas account (or local MongoDB)
- Docker (optional, for containerized setup)

### Local Development

**1. Clone the repository**
```bash
git clone <repository-url>
cd smart-leads-dashboard
```

**2. Setup Backend**
```bash
cd backend
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret
npm install
npm run dev
```

**3. Setup Frontend**
```bash
cd frontend
npm install
npm run dev
```

The backend runs on `http://localhost:5000` and the frontend on `http://localhost:5173`.

### Docker Setup

**1. Create root `.env` from the example**
```bash
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret
```

**2. Build and run with Docker Compose**
```bash
docker-compose up --build
```

The app will be available at `http://localhost:80`.

---

## API Documentation

### Authentication

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | Public | Register a new user |
| `POST` | `/api/auth/login` | Public | Login and receive JWT |

#### POST `/api/auth/register`
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "sales"   // "admin" | "sales"
}
```

#### POST `/api/auth/login`
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "token": "<jwt_token>",
  "user": { "_id": "...", "name": "John Doe", "email": "...", "role": "sales" }
}
```

---

### Leads

All leads endpoints require `Authorization: Bearer <token>` header.

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/leads` | All | Get paginated leads list with filters |
| `POST` | `/api/leads` | All | Create a new lead |
| `GET` | `/api/leads/:id` | All | Get a single lead |
| `PUT` | `/api/leads/:id` | All (own) / Admin | Update a lead |
| `DELETE` | `/api/leads/:id` | Admin only | Delete a lead |
| `GET` | `/api/leads/export` | Admin only | Export leads as CSV |

#### GET `/api/leads` — Query Parameters

| Parameter | Type | Example | Description |
|---|---|---|---|
| `page` | number | `1` | Page number (default: 1) |
| `status` | string | `Qualified` | Filter by status |
| `source` | string | `Instagram` | Filter by source |
| `search` | string | `Rahul` | Search name or email |
| `sort` | string | `latest` | `latest` or `oldest` |

**Example:** `/api/leads?status=Qualified&source=Instagram&search=Rahul&sort=latest&page=1`

**Response:**
```json
{
  "leads": [...],
  "pagination": {
    "total": 42,
    "page": 1,
    "pages": 5,
    "limit": 10
  }
}
```

#### POST `/api/leads`
```json
{
  "name": "Rahul Sharma",
  "email": "rahul@example.com",
  "status": "New",
  "source": "Instagram"
}
```

---

## Role-Based Access Control

| Feature | Admin | Sales User |
|---|---|---|
| View leads | All leads | Own leads only |
| Create lead | ✅ | ✅ |
| Update lead | Any lead | Own leads only |
| Delete lead | ✅ | ❌ |
| Export CSV | ✅ | ❌ |

---

## Environment Variables

See `backend/.env.example`:

```
PORT=5000
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=7d
```

---

## Author

Built as part of the ServiceHive Full Stack Internship Assignment.
