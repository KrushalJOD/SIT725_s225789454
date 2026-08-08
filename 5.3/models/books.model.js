// models/books.model.js
const mongoose = require('mongoose');

// Allowed genre categories (domain-appropriate closed list, keeps genre data consistent
// and prevents free-text typos like "Sci-fi" vs "Science Fiction" fragmenting the catalogue).
const ALLOWED_GENRES = [
  'Science Fiction',
  'Classic',
  'Historical Fiction',
  'Fantasy',
  'Non-Fiction',
  'Mystery',
  'Romance',
  'Horror',
  'Poetry',
  'Other'
];

// Schema defines shape, types, and field-level validation rules.
// price is stored as Decimal128 in AUD; getter converts it to a string for JSON output.
const BookSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: [true, 'id is required.'],
      unique: true,
      trim: true,
      match: [
        /^[a-zA-Z0-9_-]{1,50}$/,
        'id must be 1-50 characters and may only contain letters, numbers, hyphens, or underscores.'
      ]
    },
    title: {
      type: String,
      required: [true, 'title is required.'],
      trim: true,
      minlength: [1, 'title must not be empty.'],
      maxlength: [200, 'title must be 200 characters or fewer.']
    },
    author: {
      type: String,
      required: [true, 'author is required.'],
      trim: true,
      minlength: [1, 'author must not be empty.'],
      maxlength: [150, 'author must be 150 characters or fewer.']
    },
    year: {
      type: Number,
      required: [true, 'year is required.'],
      validate: [
        {
          validator: Number.isInteger,
          message: 'year must be a whole number (integer).'
        },
        {
          validator: (v) => v >= 1450,
          message: 'year must be 1450 or later (after the invention of the printing press).'
        },
        {
          validator: (v) => v <= new Date().getFullYear(),
          message: 'year cannot be in the future.'
        }
      ]
    },
    genre: {
      type: String,
      required: [true, 'genre is required.'],
      trim: true,
      enum: {
        values: ALLOWED_GENRES,
        message: `genre must be one of: ${ALLOWED_GENRES.join(', ')}.`
      }
    },
    summary: {
      type: String,
      required: [true, 'summary is required.'],
      trim: true,
      minlength: [10, 'summary must be at least 10 characters.'],
      maxlength: [3000, 'summary must be 3000 characters or fewer.']
    },
    price: {
      type: mongoose.Schema.Types.Decimal128,
      required: [true, 'price is required.'],
      get: (v) => v?.toString(),
      validate: {
        validator: function (v) {
          if (v === null || v === undefined) return false;
          const num = parseFloat(v.toString());
          return !Number.isNaN(num) && num > 0 && num <= 100000;
        },
        message: 'price must be a positive number no greater than 100000.'
      }
    },
    currency: { type: String, required: true, default: 'AUD' }
  },
  {
    toJSON: {
      getters: true,
      virtuals: false,
      transform(_doc, ret) {
        delete ret.__v;
        return ret;
      }
    },
    toObject: { getters: true, virtuals: false }
  }
);

module.exports = mongoose.model('Book', BookSchema);
module.exports.ALLOWED_GENRES = ALLOWED_GENRES;
