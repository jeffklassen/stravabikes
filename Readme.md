# Stravanal

A testbed for strava analytics.

## Prerequisites

- Docker & Docker Compose
- Node.js 22+
- A Strava application (for OAuth credentials)

## Getting Started

1. **Start the database:**
   ```bash
   docker-compose up -d mongodb
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set environment variables:**
   ```bash
   export CLIENTSECRET=your_strava_client_secret
   ```

4. **Start the application:**
   ```bash
   npm run dev
   ```

The application will be available at:
- Frontend: http://localhost:3000
- Database UI: http://localhost:8081 (MongoDB Express)

## Architecture

- **Frontend**: React 19 + Vite (TypeScript)
- **Backend**: Express 5 + TypeScript
- **Database**: MongoDB 7 (Docker container)
- **Authentication**: Strava OAuth

## Available Scripts

- `npm run dev` - Start development servers (client + server)
- `npm run build` - Build for production
- `npm run type-check` - Run TypeScript compilation check
- `npm test` - Run tests with Vitest