# Interactive Shell Backend

This is the backend server for the Interactive Shell website.

## Features

- Express server with REST API endpoints
- JWT-based user authentication
- Real-time terminal sessions using socket.io
- AI assistant integration using OpenAI API
- Shodan API integration for security search

## Setup

1. Install dependencies:

```bash
npm install
```

2. Start the server:

```bash
node server.js
```

The server will run on port 1234 by default.

## API Endpoints

- POST /api/login - User login, returns JWT token
- GET /api/protected - Protected endpoint, requires JWT token
- POST /api/ai-assistant - AI assistant endpoint, requires JWT token
- POST /api/shodan-search - Shodan search endpoint, requires JWT token

## WebSocket

- Connect to the server via socket.io for real-time terminal sessions.

## Notes

- Replace the user store with a real database in production.
- Integrate a real terminal backend (e.g., pty.js) for full terminal functionality.
- Secure the JWT secret key and environment variables.

## Changelog

See CHANGELOG.md for details.
