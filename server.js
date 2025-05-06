// Required modules
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const fetch = require('node-fetch');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: '*',
  }
});

const SECRET_KEY = 'your_jwt_secret_key'; // Replace with secure key in production
const PERPLEXITY_API_KEY = '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';

app.use(cors());
app.use(bodyParser.json());

// Serve static frontend files
app.use(express.static(path.join(__dirname)));

// Simple user store (replace with DB in production)
const users = [
  { id: 1, username: 'user1', password: 'password1' },
];

// Authentication middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.sendStatus(401);
  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

// Login endpoint
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });
  const token = jwt.sign({ username: user.username, id: user.id }, SECRET_KEY, { expiresIn: '1h' });
  res.json({ token });
});

// Protected test endpoint
app.get('/api/protected', authenticateToken, (req, res) => {
  res.json({ message: 'This is protected data.', user: req.user });
});

// AI assistant endpoint
app.post('/api/ai-assistant', authenticateToken, async (req, res) => {
  const { prompt } = req.body;
  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  try {
    const response = await fetch('https://api.perplexity.ai/ai/ask', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': PERPLEXITY_API_KEY,
      },
      body: JSON.stringify({ prompt }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return res.status(response.status).json({ error: errorText });
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('AI assistant error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// WebSocket connection for terminal sessions
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  // Here you would integrate with a real terminal backend (e.g., pty.js)
  socket.on('terminal-input', (data) => {
    console.log('Terminal input:', data);
    // Echo back for demo
    socket.emit('terminal-output', `You typed: ${data}`);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// AI assistant endpoint with OpenAI API integration
// Shodan API integration
const SHODAN_API_KEY = 'Em34OXS0Vo1fASHmsJmFgCcsSeZJJrvv';

app.post('/api/shodan-search', authenticateToken, async (req, res) => {
  const { query } = req.body;
  if (!query) {
    return res.status(400).json({ error: 'Query is required' });
  }

  try {
    const response = await fetch(`https://api.shodan.io/shodan/host/search?key=${SHODAN_API_KEY}&query=${encodeURIComponent(query)}`);
    if (!response.ok) {
      const errorText = await response.text();
      return res.status(response.status).json({ error: errorText });
    }
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Shodan API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

const PORT = process.env.PORT || 1234;
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
