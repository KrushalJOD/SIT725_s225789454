// controllers/books.controller.js
// Controller: parses the request, enforces safe-write rules, calls the service,
// and maps results / errors to precise HTTP status codes.

const booksService = require('../services/books.service');

const STUDENT_ID = 's225789454'; // TODO: replace with your own student id

// Only these fields may ever be written by a client. Anything else is rejected.
const ALLOWED_WRITE_FIELDS = ['id', 'title', 'author', 'year', 'genre', 'summary', 'price'];
const REQUIRED_CREATE_FIELDS = ['id', 'title', 'author', 'year', 'genre', 'summary', 'price'];
const REQUIRED_UPDATE_FIELDS = ['title', 'author', 'year', 'genre', 'summary', 'price'];

// Returns an array of keys in `body` that are not in `allowed`.
function findUnknownFields(body, allowed) {
  return Object.keys(body || {}).filter((key) => !allowed.includes(key));
}

// Returns an array of required field names that are missing / empty in `body`.
function findMissingFields(body, required) {
  return required.filter((field) => {
    const value = body ? body[field] : undefined;
    return value === undefined || value === null || value === '';
  });
}

// Converts a Mongoose ValidationError into a single readable message.
function formatValidationError(err) {
  const messages = Object.values(err.errors || {}).map((e) => e.message);
  return messages.length > 0 ? messages.join(' ') : 'Validation failed.';
}

// GET /api/books
exports.getAllBooks = async (_req, res, next) => {
  try {
    const items = await booksService.getAllBooks();
    res.status(200).json({
      statusCode: 200,
      data: items,
      message: 'Books retrieved using service',
      developedBy: STUDENT_ID
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
        message: `No book found with id '${req.params.id}'`,
        developedBy: STUDENT_ID
      });
    }

    res.status(200).json({
      statusCode: 200,
      data: book,
      message: 'Book retrieved using service',
      developedBy: STUDENT_ID
    });
  } catch (err) {
    next(err);
  }
};

// POST /api/books
exports.createBook = async (req, res, next) => {
  try {
    const body = req.body || {};

    // 1) Reject any field that isn't part of the documented schema.
    const unknown = findUnknownFields(body, ALLOWED_WRITE_FIELDS);
    if (unknown.length > 0) {
      return res.status(400).json({
        statusCode: 400,
        data: null,
        message: `Unexpected field(s): ${unknown.join(', ')}. Only ${ALLOWED_WRITE_FIELDS.join(', ')} are accepted.`,
        developedBy: STUDENT_ID
      });
    }

    // 2) Reject if any required field is missing.
    const missing = findMissingFields(body, REQUIRED_CREATE_FIELDS);
    if (missing.length > 0) {
      return res.status(400).json({
        statusCode: 400,
        data: null,
        message: `Missing required field(s): ${missing.join(', ')}.`,
        developedBy: STUDENT_ID
      });
    }

    // 3) Delegate to the service. Mongoose schema validators enforce type,
    //    boundary, length, and temporal rules on save().
    const created = await booksService.createBook({
      id: body.id,
      title: body.title,
      author: body.author,
      year: body.year,
      genre: body.genre,
      summary: body.summary,
      price: body.price
    });

    res.status(201).json({
      statusCode: 201,
      data: created,
      message: 'Book created',
      developedBy: STUDENT_ID
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({
        statusCode: 409,
        data: null,
        message: `A book with id '${req.body && req.body.id}' already exists.`,
        developedBy: STUDENT_ID
      });
    }
    if (err.name === 'ValidationError' || err.name === 'CastError') {
      return res.status(400).json({
        statusCode: 400,
        data: null,
        message: err.name === 'CastError'
          ? `Invalid value for field '${err.path}': ${err.value}.`
          : formatValidationError(err),
        developedBy: STUDENT_ID
      });
    }
    next(err);
  }
};

// PUT /api/books/:id
exports.updateBook = async (req, res, next) => {
  try {
    const routeId = req.params.id;
    const body = req.body || {};

    // 1) Reject any field that isn't part of the documented schema.
    const unknown = findUnknownFields(body, ALLOWED_WRITE_FIELDS);
    if (unknown.length > 0) {
      return res.status(400).json({
        statusCode: 400,
        data: null,
        message: `Unexpected field(s): ${unknown.join(', ')}. Only ${ALLOWED_WRITE_FIELDS.join(', ')} are accepted.`,
        developedBy: STUDENT_ID
      });
    }

    // 2) id is immutable: it may be omitted, but if present it must match the route param.
    if (Object.prototype.hasOwnProperty.call(body, 'id') && body.id !== routeId) {
      return res.status(400).json({
        statusCode: 400,
        data: null,
        message: "Field 'id' is immutable and cannot be changed via update.",
        developedBy: STUDENT_ID
      });
    }

    // 3) PUT is a full replace of the editable fields, so all of them are required.
    const missing = findMissingFields(body, REQUIRED_UPDATE_FIELDS);
    if (missing.length > 0) {
      return res.status(400).json({
        statusCode: 400,
        data: null,
        message: `Missing required field(s): ${missing.join(', ')}.`,
        developedBy: STUDENT_ID
      });
    }

    const updated = await booksService.updateBook(routeId, {
      title: body.title,
      author: body.author,
      year: body.year,
      genre: body.genre,
      summary: body.summary,
      price: body.price
    });

    if (!updated) {
      return res.status(404).json({
        statusCode: 404,
        data: null,
        message: `No book found with id '${routeId}'`,
        developedBy: STUDENT_ID
      });
    }

    res.status(200).json({
      statusCode: 200,
      data: updated,
      message: 'Book updated',
      developedBy: STUDENT_ID
    });
  } catch (err) {
    if (err.name === 'ValidationError' || err.name === 'CastError') {
      return res.status(400).json({
        statusCode: 400,
        data: null,
        message: err.name === 'CastError'
          ? `Invalid value for field '${err.path}': ${err.value}.`
          : formatValidationError(err),
        developedBy: STUDENT_ID
      });
    }
    next(err);
  }
};
