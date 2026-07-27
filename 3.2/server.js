var express = require("express");
var app = express();

// Serve static files (html/css/js/images) from the public folder
app.use(express.static(__dirname + '/public'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// ---- In-memory "data" for our new domain: Recipes ----
var recipes = [
  {
    id: 1,
    title: "Creamy Mushroom Risotto",
    image: "https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=600&q=80",
    category: "Italian",
    description: "A rich, creamy risotto made with arborio rice, wild mushrooms, and parmesan."
  },
  {
    id: 2,
    title: "Spicy Thai Basil Chicken",
    image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=600&q=80",
    category: "Thai",
    description: "A quick stir-fry with chicken, chilli, garlic, and fresh Thai basil."
  },
  {
    id: 3,
    title: "Classic Margherita Pizza",
    image: "https://images.unsplash.com/photo-1548365328-9f547fb0953b?w=600&q=80",
    category: "Italian",
    description: "Wood-fired style pizza topped with tomato, fresh mozzarella, and basil."
  },
  {
    id: 4,
    title: "Chocolate Lava Cake",
    image: "https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=600&q=80",
    category: "Dessert",
    description: "A warm chocolate cake with a gooey molten centre, served with ice cream."
  }
];

// Simple GET REST endpoint, consumed by the client (public/js/scripts.js)
app.get('/api/recipes', (req, res) => {
  res.json(recipes);
});

var port = process.env.port || 3000;
app.listen(port, () => {
  console.log("App listening to: " + port);
});
