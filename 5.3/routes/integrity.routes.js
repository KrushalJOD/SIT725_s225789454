// routes/integrity.routes.js
// A tiny, separate route file for the integrity-check marker endpoint.
// Kept out of books.routes.js so that file only mounts the required books routes.

const express = require('express');
const router = express.Router();

// GET /api/integrity-check42 -> 204 No Content
router.get('/integrity-check42', (_req, res) => {
  res.status(204).send();
});

module.exports = router;
