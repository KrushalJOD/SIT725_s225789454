// models/books.model.js
const mongoose = require('mongoose');

// Schema defines shape and types.
// price is stored as Decimal128 in AUD; getter converts it to a string for JSON output.
const BookSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true },
    author: { type: String, required: true },
    year: { type: Number, required: true },
    genre: { type: String, required: true },
    summary: { type: String, required: true },
    price: { type: mongoose.Schema.Types.Decimal128, required: true, get: (v) => v?.toString() },
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
