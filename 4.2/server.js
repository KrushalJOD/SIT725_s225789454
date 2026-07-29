var express = require("express");
var app = express();
var mongoose = require('mongoose');
var Game = require('./models/Game');

var port = process.env.PORT || 3004;

// Middleware
app.use(express.static(__dirname + '/public'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Connect to MongoDB - using a different DB name to the prac example
mongoose.connect('mongodb://127.0.0.1:27017/boardGameLibrary');

mongoose.connection.on('connected', () => {
  console.log('Connected to MongoDB (boardGameLibrary)');
});

mongoose.connection.on('error', (err) => {
  console.log('MongoDB connection error: ' + err);
});

// GET all games
app.get('/api/games', async (req, res) => {
  try {
    const games = await Game.find({});
    res.json({ statusCode: 200, data: games, message: "Success" });
  } catch (err) {
    res.status(500).json({ statusCode: 500, message: err.message });
  }
});

// SAFE WRITE - Create a new game
// Only allowlisted fields are pulled from req.body, and schema validation runs on save()
app.post('/api/games', async (req, res) => {
  try {
    const { name, category, players, duration, summary, coverImage } = req.body;
    const game = new Game({ name, category, players, duration, summary, coverImage });
    await game.save(); // schema validation runs here
    res.status(201).json({
      statusCode: 201,
      message: "Game added successfully",
      data: game
    });
  } catch (err) {
    res.status(400).json({
      statusCode: 400,
      message: err.message
    });
  }
});

// SAFE WRITE - Update an existing game
// findOneAndUpdate with runValidators ensures atomic + validated update
app.put('/api/games/:id', async (req, res) => {
  try {
    const { name, category, players, duration, summary, coverImage } = req.body;
    const updated = await Game.findOneAndUpdate(
      { _id: req.params.id },
      { $set: { name, category, players, duration, summary, coverImage } },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ statusCode: 404, message: "Game not found" });
    }

    res.json({ statusCode: 200, message: "Game updated successfully", data: updated });
  } catch (err) {
    res.status(400).json({ statusCode: 400, message: err.message });
  }
});

app.listen(port, () => {
  console.log("App listening to: " + port);
});
