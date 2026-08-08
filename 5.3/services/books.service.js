// services/books.service.js
// Service layer: only data access (CRUD). No business logic, no hardcoded data.

const Book = require('../models/books.model');

// Return all books as plain objects (getters applied so price is a string)
const getAllBooks = async () => {
  const docs = await Book.find({});
  return docs.map((doc) => doc.toJSON());
};

// Return a single book by its custom id field, or null if not found
const getBookById = async (id) => {
  const doc = await Book.findOne({ id });
  return doc ? doc.toJSON() : null;
};

// Create a new book. Throws Mongoose ValidationError / CastError / duplicate-key
// errors up to the controller, which is responsible for mapping them to HTTP responses.
const createBook = async (data) => {
  const book = new Book(data);
  await book.save();
  return book.toJSON();
};

// Update an existing book identified by id. Returns null if no book has that id.
// Throws Mongoose ValidationError / CastError up to the controller on invalid data.
const updateBook = async (id, data) => {
  const doc = await Book.findOne({ id });
  if (!doc) return null;

  doc.title = data.title;
  doc.author = data.author;
  doc.year = data.year;
  doc.genre = data.genre;
  doc.summary = data.summary;
  doc.price = data.price;

  await doc.save();
  return doc.toJSON();
};

module.exports = {
  getAllBooks,
  getBookById,
  createBook,
  updateBook
};
