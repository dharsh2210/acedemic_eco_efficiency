require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');

const app = express();

connectDB().catch(err => {
  console.error('DB connection failed:', err);
  process.exit(1);
});

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());

// API routes
app.use('/api/auth',    require('./routes/auth'));
app.use('/api/users',   require('./routes/users'));
app.use('/api/entries', require('./routes/entries'));
app.use('/api/alerts',  require('./routes/alerts'));
app.use('/api/tickets', require('./routes/tickets'));

app.get('/api/health', (_, res) => res.json({ ok: true }));

// ✅ Serve React build (correct for your structure)
const buildPath = path.join(__dirname, '../frontend/build');

app.use(express.static(buildPath));

app.get('*', (req, res) => {
  if (!req.path.startsWith('/api')) {
    res.sendFile(path.join(buildPath, 'index.html'));
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));