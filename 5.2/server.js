// server.js
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');

const PORT = 3000;

// 1. Connect to MongoDB (hardcoded URI, localhost, DB name: booksDB)
mongoose.connect('mongodb://localhost:27017/booksDB');

mongoose.connection.on('connected', () => {
  console.log('✅ Connected to MongoDB (booksDB)');
});

mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err.message);
});

// 2. App + middleware
const app = express();
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Import route file
const booksRoute = require('./routes/books.routes');

// Mount the route at /api/books
app.use('/api/books', booksRoute);

// Root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Basic error handler (catches next(err) from controllers)
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({
    statusCode: 500,
    data: null,
    message: 'Something went wrong'
  });
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
