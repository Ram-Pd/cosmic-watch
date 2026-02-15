# COSMIC WATCH

**Interstellar Asteroid Tracker & Risk Analyser**

Real-time Near-Earth Object monitoring using NASA APIs, with risk analysis, user alerts, and a SpaceX-inspired cinematic UI.

---

## Quick start (Docker)

```bash
cd cosmic-watch
# Create .env with your NASA API key (get one free at https://api.nasa.gov)
echo "NASA_API_KEY=your_key_here" > .env
docker-compose up --build
```

- **Frontend:** http://localhost:3000  
- **Backend API:** http://localhost:5000  

The whole platform (frontend, backend, MongoDB) runs with one command.

---

## Architecture

```
                    +------------------+
                    |     Browser      |
                    +--------+---------+
                             |
         +-------------------+-------------------+
         |                                       |
         v                                       v
+----------------+                    +----------------+
|   Frontend     |  /api, /socket.io   |    Backend     |
|   (nginx:3000) | ------------------> | (Express:5000) |
+----------------+      proxy          +--------+-------+
                                                      |
                              +-----------------------+-----------------------+
                              |                       |                       |
                              v                       v                       v
                    +----------------+      +----------------+      +----------------+
                    |    MongoDB     |      |  NASA NeoWs    |      |  Socket.io     |
                    |   (27017)      |      |     API        |      |  (chat)        |
                    +----------------+      +----------------+      +----------------+
```

- **Frontend:** React (Vite), Tailwind, Framer Motion. Served by nginx in Docker.
- **Backend:** Node.js, Express, Mongoose. Auth (JWT), asteroid feed/risk, alerts, optional chat.
- **MongoDB:** Users, alerts, chat messages. Volume for persistence.

---

## Environment variables

| Variable       | Required | Description |
|----------------|----------|-------------|
| `NASA_API_KEY` | Yes      | Get at [api.nasa.gov](https://api.nasa.gov) (free). |
| `MONGODB_URI`  | No       | Default: `mongodb://localhost:27017/cosmic-watch` (override in Docker). |
| `JWT_SECRET`   | No       | Default: `cosmic-watch-secret-change-in-production`. |
| `PORT`         | No       | Backend port; default `5000`. |

For Docker, set `NASA_API_KEY` before `docker-compose up`. Optionally set `JWT_SECRET`.

---

## API endpoints

### Auth
- `POST /api/auth/register` – Body: `{ name, email, password }`. Returns `{ token, user }`.
- `POST /api/auth/login` – Body: `{ email, password }`. Returns `{ token, user }`.
- `GET /api/auth/profile` – Header: `Authorization: Bearer <token>`. Returns `{ user }`.
- `PATCH /api/auth/profile` – Header: `Authorization: Bearer <token>`. Body: `{ watchedAsteroids?, alertSettings? }`. Returns `{ user }`.

### Asteroids (NASA NeoWs)
- `GET /api/asteroids/feed?date=YYYY-MM-DD` – Simplified NEO list (id, name, velocity, miss_distance, diameter, hazardous, close_approach_date).
- `GET /api/asteroids/:id` – Detailed NEO by ID.
- `GET /api/asteroids/risk?date=YYYY-MM-DD` – Risk-categorized list: `{ LOW, MODERATE, HIGH, CRITICAL }`.

### Alerts (protected)
- `GET /api/alerts` – Header: `Authorization: Bearer <token>`. Returns `{ alerts }`.

### Chat
- `GET /api/chat/recent` – Last 20 messages (REST). Real-time: Socket.io room `asteroid`, events `message` / `messages`.

### Health
- `GET /api/health` – `{ status: 'ok' }`.

---

## Running without Docker

### Backend
```bash
cd backend
cp .env.example .env   # or create .env with NASA_API_KEY, MONGODB_URI, JWT_SECRET
npm install
npm run dev
```
Ensure MongoDB is running (e.g. local or Atlas).

### Frontend
```bash
cd frontend
npm install
npm run dev
```
Uses Vite proxy: `/api` and `/socket.io` → `http://localhost:5000`.

---

## NASA API key

1. Go to [https://api.nasa.gov](https://api.nasa.gov).
2. Sign up and get an API key.
3. Set `NASA_API_KEY=your_key` in env or `docker-compose` run.

---

## Project structure

```
cosmic-watch/
├── frontend/          # React + Vite + Tailwind + Framer Motion
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── hooks/
│   ├── Dockerfile
│   └── nginx.conf
├── backend/          # Node.js + Express + MongoDB
│   ├── src/
│   │   ├── routes/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── models/
│   │   └── middleware/
│   └── Dockerfile
├── docker-compose.yml
└── README.md
```

---

## License

MIT.
