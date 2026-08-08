// services/books.service.js
// Service layer: only queries the database. No business logic, no hardcoded data.

const Book = require('../models/books.model');

// Return all books as plain objects with getters applied (price converted to string)
const getAllBooks = async () => {
  const docs = await Book.find({});
  return docs.map((doc) => doc.toJSON());
};

// Return a single book by its custom id field, or null if not found
const getBookById = async (id) => {
  const doc = await Book.findOne({ id });
  return doc ? doc.toJSON() : null;
};

module.exports = {
  getAllBooks,
  getBookById
};