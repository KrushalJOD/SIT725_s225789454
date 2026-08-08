// routes/books.routes.js
// Routes only map URLs to controller functions. No business logic here.

const express = require('express');
const router = express.Router();

// Import all controllers via controllers/index.js
const Controllers = require('../controllers');

// GET /api/books
router.get('/', Controllers.booksController.getAllBooks);

// GET /api/books/:id
router.get('/:id', Controllers.booksController.getBookById);

// POST /api/books (safe write: create)
router.post('/', Controllers.booksController.createBook);

// PUT /api/books/:id (safe write: update)
router.put('/:id', Controllers.booksController.updateBook);

module.exports = router;
