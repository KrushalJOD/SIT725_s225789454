# SIT725 3.2P – Getting Graphical – Recipe Explorer

A small Express + Materialize web app built for SIT725 Task 3.2P.

It follows the same architecture as the Week 3 practical (Bootstrapping Express App):

```
sit725-3.2p-recipes/
├── package.json
├── server.js
└── public/
    ├── index.html
    ├── css/
    │   └── styles.css
    ├── js/
    │   └── scripts.js
    └── images/        (optional local images if you don't want to use image URLs)
```

- **Domain**: Recipes (instead of the kitten/cards demo used in the practical).
- **Architecture**: Express app + Materialize UI + simple GET REST endpoint consumed on the client, exactly as required.
- **API**: `GET /api/recipes` returns a JSON array of recipe objects (`id`, `title`, `image`, `category`, `description`).
- **Client**: `public/js/scripts.js` calls `/api/recipes` with jQuery's `$.get()` and builds Materialize cards dynamically, the same pattern shown in the practical's "Advance Components Materialize" section.
- A Materialize **modal** with a form lets you "suggest" a new recipe (logged to console and appended as a new card), mirroring the modal/form example from the practical.

## Run locally

See the step-by-step Mac guide provided separately.

## Submission

1. Push this code to your own GitHub repo (see Task 1.3P guidelines for git setup).
2. Take screenshots of the running app (home page, cards loaded, modal open, console showing submitted data).
3. Convert the screenshots into a single PDF.
4. Upload the PDF + your repo link to OnTrack.
