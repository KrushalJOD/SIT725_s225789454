# 5.3D — Validation Rules & Endpoints (for your OnTrack report)

Copy the tables below into your report. Replace `<your repo link>` with your actual GitHub link.

## Repo link
`<your repo link>`

## Validation rules table

| Field | Rule | Justification |
|---|---|---|
| `id` | Required, string, 1–50 characters, pattern `^[a-zA-Z0-9_-]+$`, unique, **immutable on update** | A stable, URL-safe primary key prevents ambiguous lookups and broken links; immutability stops a client from silently reassigning one book's identity to another record. |
| `title` | Required, string, 1–200 characters | Every book needs a name; the upper bound stops accidental pasting of large blocks of text into a title field, keeping the UI list readable. |
| `author` | Required, string, 1–150 characters | Same reasoning as title — a name is required, and a sane upper bound keeps the field to its intended purpose. |
| `year` | Required, integer, 1450 ≤ year ≤ current year | 1450 reflects the earliest realistic publication date (movable-type printing); disallowing future years stops obviously incorrect or placeholder data (e.g. "year: 9999") from entering the catalogue. |
| `genre` | Required, must be one of a fixed enum (`Science Fiction`, `Classic`, `Historical Fiction`, `Fantasy`, `Non-Fiction`, `Mystery`, `Romance`, `Horror`, `Poetry`, `Other`) | A closed list keeps genre data consistent for filtering/searching later, instead of free text fragmenting into "Sci-Fi", "sci fi", "Science-Fiction", etc. |
| `summary` | Required, string, 10–3000 characters | A minimum length ensures the summary is actually descriptive rather than a placeholder like "n/a"; the maximum keeps the payload and UI reasonable. |
| `price` | Required, `Decimal128`, 0 < price ≤ 100000 (AUD) | Prices must be positive to make business sense; the upper bound guards against obvious data-entry errors (e.g. an extra zero) while still allowing legitimately expensive items. |
| *(write requests)* | Only `id, title, author, year, genre, summary, price` are ever accepted; any other field is rejected | Prevents clients from injecting unexpected fields (e.g. `currency`, `_id`, or arbitrary properties) into the database — a core "safe writes" principle. |

## Endpoints implemented

| Method + Path | Purpose | Status codes | Payload shape |
|---|---|---|---|
| `GET /api/books` | List all books | `200 OK` | `{ statusCode, data: Book[], message, developedBy }` |
| `GET /api/books/:id` | Get one book | `200 OK`, `404 Not Found` if no book has that id | `{ statusCode, data: Book \| null, message, developedBy }` |
| `POST /api/books` | Create a book (safe write) | `201 Created` on success · `400 Bad Request` on missing/invalid/unexpected fields · `409 Conflict` on duplicate `id` | Request: `{ id, title, author, year, genre, summary, price }`. Response: `{ statusCode, data: Book, message, developedBy }` |
| `PUT /api/books/:id` | Update a book (safe write) | `200 OK` on success · `400 Bad Request` on missing/invalid/unexpected fields or an attempt to change `id` · `404 Not Found` if the id doesn't exist | Request: `{ title, author, year, genre, summary, price }` (id is taken from the URL and is immutable). Response: `{ statusCode, data: Book, message, developedBy }` |
| `GET /api/integrity-check42` | Student ID / integrity marker endpoint | `204 No Content` | No body |

**Why these status codes:**
- `201` distinguishes "a new resource was created" from `200`, which is reserved for reads/updates of existing resources.
- `400` is used consistently for anything the client did wrong (missing fields, wrong types, out-of-range values, unexpected fields, attempting to change an immutable field) — with a clear message describing exactly what failed.
- `409` specifically flags a conflict with an existing resource (duplicate `id`), which is a more precise signal to the client than a generic `400`.
- `404` is reserved for "the record referenced in the URL doesn't exist", separate from validation problems with the request body.
