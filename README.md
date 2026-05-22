# Car Showroom Web Application

Full-stack MERN car browsing and purchasing app.

## Stack

- **Frontend:** React 19, Vite, React Router (Vercel)
- **Backend:** Express 5, MongoDB/Mongoose (Render)
- **Auth:** JWT in httpOnly cookies

## Local setup

### Backend

```bash
cd backend
cp .env.example .env
# Edit .env — set MONGO_URI and JWT_SECRET (min 16 chars)
npm install
npm run dev
```

### Frontend

```bash
cd frontend
cp .env.example .env
# Set VITE_API_URL=http://localhost:5000/api
npm install
npm run dev
```

Or from `backend`: `npm run dev` runs both API and Vite.

### Seed database

```bash
cd backend
node seed.js
```

## Production notes

- Set `NODE_ENV=production` on Render
- Configure Render health check: `GET /health`
- Ensure `JWT_SECRET` is a long random string
- CORS allows localhost, production Vercel URLs, and preview deploys

## API overview

| Route | Description |
|-------|-------------|
| `POST /api/auth/register` | Register (role always `user`) |
| `POST /api/auth/login` | Login |
| `GET /api/auth/me` | Current user |
| `GET /api/cars` | Paginated catalog (`?page=1&limit=20`) |
| `GET /api/cars/:id` | Car detail |
| `POST /api/order` | Place order (transactional stock) |
| `GET /api/order/admin/all` | Admin orders |
