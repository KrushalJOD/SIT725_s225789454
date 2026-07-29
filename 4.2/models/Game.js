const mongoose = require('mongoose');

// Schema uses different fields to the Prac 4 example (name/category/players/duration/summary/coverImage)
// with real validation rules so runValidators actually does something.
const GameSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 80
  },
  category: {
    type: String,
    required: true,
    enum: ['Strategy', 'Party', 'Cooperative', 'Card Game', 'Family']
  },
  players: {
    type: Number,
    required: true,
    min: 1,
    max: 20
  },
  duration: {
    type: Number, // minutes
    required: true,
    min: 5,
    max: 480
  },
  summary: {
    type: String,
    required: true,
    maxlength: 300
  },
  coverImage: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Game', GameSchema);
