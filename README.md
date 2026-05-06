# LinkBin

LinkBin is a MERN stack URL shortener and paste sharing platform built as an interview-ready backend-heavy project.

## Core Features

- URL shortening with random codes and custom aliases
- Paste sharing with public, unlisted, and private visibility
- JWT authentication
- Redis caching for URL redirects
- Redis-based rate limiting
- Expiry support for URLs and pastes
- Analytics for URLs and pastes
- Docker Compose setup for local development

## Tech Stack

- MongoDB
- Express.js
- React
- Node.js
- Redis
- JWT
- Docker
- Docker Compose

## Backend APIs

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `POST /api/urls`
- `GET /api/urls`
- `GET /:shortCode`
- `POST /api/pastes`
- `GET /api/pastes`
- `GET /p/:slug`
- `GET /api/dashboard/summary`
- `GET /api/docs`

## Local Backend Setup

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

MongoDB and Redis are expected locally. On the personal PC, use Docker Compose:

```bash
docker compose up --build
```

## Local Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```
