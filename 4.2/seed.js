const mongoose = require('mongoose');
const Game = require('./models/Game');

mongoose.connect('mongodb://127.0.0.1:27017/boardGameLibrary');

mongoose.connection.on('connected', async () => {
  console.log('Connected to MongoDB - seeding sample data...');

  await Game.deleteMany({}); // clear existing so re-running the seed doesn't duplicate

  const sampleGames = [
    {
      name: "Catan",
      category: "Strategy",
      players: 4,
      duration: 90,
      summary: "Trade, build, and settle the island of Catan in this classic resource-management game.",
      coverImage: "https://placehold.co/400x250/26a69a/ffffff?text=Catan"
    },
    {
      name: "Codenames",
      category: "Party",
      players: 8,
      duration: 20,
      summary: "Two rival spymasters give one-word clues to help their teammates find secret agents.",
      coverImage: "https://placehold.co/400x250/2e7d32/ffffff?text=Codenames"
    },
    {
      name: "Pandemic",
      category: "Cooperative",
      players: 4,
      duration: 45,
      summary: "Work together as a team of specialists to stop four diseases from spreading across the globe.",
      coverImage: "https://placehold.co/400x250/00695c/ffffff?text=Pandemic"
    }
  ];

  await Game.insertMany(sampleGames);
  console.log("Sample games saved!");
  mongoose.connection.close();
});

mongoose.connection.on('error', (err) => {
  console.log('MongoDB connection error: ' + err);
});
