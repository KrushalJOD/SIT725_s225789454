# SIT725 4.2P - Board Game Library

A small Express + MongoDB (Mongoose) app that stores and serves a collection
of board games through a REST API, based on the approach from Prac 4 but
using a different theme and data model (games instead of kitten "projects").

## Fields
- `name` (String, required, 2-80 chars)
- `category` (String, required, one of Strategy/Party/Cooperative/Card Game/Family)
- `players` (Number, required, 1-20)
- `duration` (Number, required, 5-480 minutes)
- `summary` (String, required, max 300 chars)
- `coverImage` (String, required)

## Setup
```bash
npm install
npm run seed     # inserts 3 sample games into MongoDB
npm start        # starts the server on http://localhost:3004
```

## API
- `GET /api/games` - list all games
- `POST /api/games` - create a game (allowlisted fields + schema validation = safe write)
- `PUT /api/games/:id` - update a game (findOneAndUpdate + runValidators = safe write)
