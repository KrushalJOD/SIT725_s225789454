// controllers/books.controller.js
// Controller: parses the request, calls the service, sets status + JSON.

const booksService = require('../services/books.service');

// GET /api/books
exports.getAllBooks = async (_req, res, next) => {
  try {
    const items = await booksService.getAllBooks();
    res.status(200).json({
      statusCode: 200,
      data: items,
      message: 'Books retrieved using service'
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/books/:id
exports.getBookById = async (req, res, next) => {
  try {
    const book = await booksService.getBookById(req.params.id);

    if (!book) {
      return res.status(404).json({
        statusCode: 404,
        data: null,
        message: `No book found with id '${req.params.id}'`
      });
    }

    res.status(200).json({
      statusCode: 200,
      data: book,
      message: 'Book retrieved using service'
    });
  } catch (err) {
    next(err);
  }
};
