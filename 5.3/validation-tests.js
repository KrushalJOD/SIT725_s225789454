/**
 * SIT725 – 5.3D Validation Tests (MANDATORY TEMPLATE)
 *
 * HOW TO RUN: (Node.js 18+ is required)
 *   1. Start MongoDB
 *   2. Start your server (npm start)
 *   3. node validation-tests.js
 *
 * DO NOT MODIFY:
 *   - Output format (TEST|, SUMMARY|, COVERAGE|)
 *   - test() function signature
 *   - Exit behaviour
 *   - coverageTracker object
 *   - Logging structure
 *
 * YOU MUST:
 *   - Modify makeValidBook() to satisfy your schema rules
 *   - Add sufficient tests to meet coverage requirements
 */

const BASE_URL = process.env.BASE_URL || "http://localhost:3000";
const API_BASE = "/api/books";

// =============================
// INTERNAL STATE (DO NOT MODIFY)
// =============================

const results = [];

const coverageTracker = {
  CREATE_FAIL: 0,
  UPDATE_FAIL: 0,
  TYPE: 0,
  REQUIRED: 0,
  BOUNDARY: 0,
  LENGTH: 0,
  TEMPORAL: 0,
  UNKNOWN_CREATE: 0,
  UNKNOWN_UPDATE: 0,
  IMMUTABLE: 0,
};

// =============================
// OUTPUTS FORMAT (DO NOT MODIFY)
// =============================

function logHeader(uniqueId) {
  console.log("SIT725_VALIDATION_TESTS");
  console.log(`BASE_URL=${BASE_URL}`);
  console.log(`API_BASE=${API_BASE}`);
  console.log(`INFO|Generated uniqueId=${uniqueId}`);
}

function logResult(r) {
  console.log(
    `TEST|${r.id}|${r.name}|${r.method}|${r.path}|expected=${r.expected}|actual=${r.actual}|pass=${r.pass ? "Y" : "N"}`
  );
}

function logSummary() {
  const failed = results.filter(r => !r.pass).length;
  console.log(
    `SUMMARY|pass=${failed === 0 ? "Y" : "N"}|failed=${failed}|total=${results.length}`
  );
  return failed === 0;
}

function logCoverage() {
  console.log(
    `COVERAGE|CREATE_FAIL=${coverageTracker.CREATE_FAIL}` +
    `|UPDATE_FAIL=${coverageTracker.UPDATE_FAIL}` +
    `|TYPE=${coverageTracker.TYPE}` +
    `|REQUIRED=${coverageTracker.REQUIRED}` +
    `|BOUNDARY=${coverageTracker.BOUNDARY}` +
    `|LENGTH=${coverageTracker.LENGTH}` +
    `|TEMPORAL=${coverageTracker.TEMPORAL}` +
    `|UNKNOWN_CREATE=${coverageTracker.UNKNOWN_CREATE}` +
    `|UNKNOWN_UPDATE=${coverageTracker.UNKNOWN_UPDATE}` +
    `|IMMUTABLE=${coverageTracker.IMMUTABLE}`
  );
}

// =============================
// HTTP HELPER
// =============================

async function http(method, path, body) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });

  const text = await res.text();
  return { status: res.status, text };
}

// =============================
// TEST REGISTRATION FUNCTION
// =============================

async function test({ id, name, method, path, expected, body, tags }) {

  const { status } = await http(method, path, body);
  const pass = status === expected;

  const result = { id, name, method, path, expected, actual: status, pass };
  results.push(result);
  logResult(result);

  // treat missing or invalid tags as []
  const safeTags = Array.isArray(tags) ? tags : [];

  safeTags.forEach(tag => {
    if (Object.prototype.hasOwnProperty.call(coverageTracker, tag)) {
      coverageTracker[tag]++;
    }
  });
}

// =============================
// STUDENT MUST MODIFY THESE
// =============================
//
// Schema rules implemented in models/books.model.js:
//   id      - required, unique, 1-50 chars, pattern ^[a-zA-Z0-9_-]+$, immutable on update
//   title   - required, 1-200 chars
//   author  - required, 1-150 chars
//   year    - required, integer, 1450 <= year <= current year (no future years)
//   genre   - required, must be one of a fixed enum list
//   summary - required, 10-3000 chars
//   price   - required, Decimal128, 0 < price <= 100000
//   Only id,title,author,year,genre,summary,price are ever accepted on write.

function makeValidBook(id) {
  return {
    id,
    title: "Valid Title",
    author: "Valid Author",
    year: 2020,
    genre: "Other",
    summary: "Valid summary text that satisfies your rules.",
    price: "9.99"
  };
}

function makeValidUpdate() {
  return {
    title: "Updated Title",
    author: "Updated Author",
    year: 2021,
    genre: "Other",
    summary: "Updated summary text.",
    price: "10.50"
  };
}

// =============================
// REQUIRED BASE TESTS (DO NOT REMOVE)
// =============================

async function run() {

  const uniqueId = `b${Date.now()}`;
  logHeader(uniqueId);

  const createPath = API_BASE;
  const updatePath = (id) => `${API_BASE}/${id}`;
  const currentYear = new Date().getFullYear();

  // ---- T01 Valid CREATE ----
  await test({
    id: "T01",
    name: "Valid create",
    method: "POST",
    path: createPath,
    expected: 201,
    body: makeValidBook(uniqueId),
    tags: []
  });

  // ---- T02 Duplicate ID ----
  await test({
    id: "T02",
    name: "Duplicate ID",
    method: "POST",
    path: createPath,
    expected: 409,
    body: makeValidBook(uniqueId),
    tags: ["CREATE_FAIL"]
  });

  // ---- T03 Immutable ID ----
  await test({
    id: "T03",
    name: "Immutable ID on update",
    method: "PUT",
    path: updatePath(uniqueId),
    expected: 400,
    body: { ...makeValidUpdate(), id: "b999" },
    tags: ["UPDATE_FAIL", "IMMUTABLE"]
  });

  // ---- T04 Unknown field CREATE ----
  await test({
    id: "T04",
    name: "Unknown field CREATE",
    method: "POST",
    path: createPath,
    expected: 400,
    body: { ...makeValidBook(`b${Date.now()+1}`), hack: true },
    tags: ["CREATE_FAIL", "UNKNOWN_CREATE"]
  });

  // ---- T05 Unknown field UPDATE ----
  await test({
    id: "T05",
    name: "Unknown field UPDATE",
    method: "PUT",
    path: updatePath(uniqueId),
    expected: 400,
    body: { ...makeValidUpdate(), hack: true },
    tags: ["UPDATE_FAIL", "UNKNOWN_UPDATE"]
  });

  // =====================================
  // ADDITIONAL TESTS FOR FULL COVERAGE
  // =====================================

  // ---- T06 REQUIRED: missing title on create ----
  await test({
    id: "T06",
    name: "Missing required field (title) on create",
    method: "POST",
    path: createPath,
    expected: 400,
    body: { ...makeValidBook(`${uniqueId}_t06`), title: undefined },
    tags: ["CREATE_FAIL", "REQUIRED"]
  });

  // ---- T07 TYPE: non-numeric year on create ----
  await test({
    id: "T07",
    name: "Non-numeric year on create",
    method: "POST",
    path: createPath,
    expected: 400,
    body: { ...makeValidBook(`${uniqueId}_t07`), year: "not-a-year" },
    tags: ["CREATE_FAIL", "TYPE"]
  });

  // ---- T08 BOUNDARY: year below minimum (1449) ----
  await test({
    id: "T08",
    name: "Year below minimum boundary (1449)",
    method: "POST",
    path: createPath,
    expected: 400,
    body: { ...makeValidBook(`${uniqueId}_t08`), year: 1449 },
    tags: ["CREATE_FAIL", "BOUNDARY"]
  });

  // ---- T09 TEMPORAL / BOUNDARY: year in the future ----
  await test({
    id: "T09",
    name: "Year in the future",
    method: "POST",
    path: createPath,
    expected: 400,
    body: { ...makeValidBook(`${uniqueId}_t09`), year: currentYear + 5 },
    tags: ["CREATE_FAIL", "TEMPORAL", "BOUNDARY"]
  });

  // ---- T10 LENGTH: summary too short (<10 chars) ----
  await test({
    id: "T10",
    name: "Summary shorter than minimum length",
    method: "POST",
    path: createPath,
    expected: 400,
    body: { ...makeValidBook(`${uniqueId}_t10`), summary: "Too short" },
    tags: ["CREATE_FAIL", "LENGTH"]
  });

  // ---- T11 LENGTH: title too long (>200 chars) ----
  await test({
    id: "T11",
    name: "Title longer than maximum length",
    method: "POST",
    path: createPath,
    expected: 400,
    body: { ...makeValidBook(`${uniqueId}_t11`), title: "A".repeat(201) },
    tags: ["CREATE_FAIL", "LENGTH"]
  });

  // ---- T12 BOUNDARY: price is zero ----
  await test({
    id: "T12",
    name: "Price at/below zero boundary",
    method: "POST",
    path: createPath,
    expected: 400,
    body: { ...makeValidBook(`${uniqueId}_t12`), price: "0" },
    tags: ["CREATE_FAIL", "BOUNDARY"]
  });

  // ---- T13 BOUNDARY: price above maximum ----
  await test({
    id: "T13",
    name: "Price above maximum boundary (100001)",
    method: "POST",
    path: createPath,
    expected: 400,
    body: { ...makeValidBook(`${uniqueId}_t13`), price: "100001" },
    tags: ["CREATE_FAIL", "BOUNDARY"]
  });

  // ---- T14 TYPE: invalid genre (not in enum) ----
  await test({
    id: "T14",
    name: "Genre outside allowed enum",
    method: "POST",
    path: createPath,
    expected: 400,
    body: { ...makeValidBook(`${uniqueId}_t14`), genre: "NotAGenre" },
    tags: ["CREATE_FAIL", "TYPE"]
  });

  // ---- T15 TYPE: id contains disallowed characters ----
  await test({
    id: "T15",
    name: "Id contains disallowed characters (space)",
    method: "POST",
    path: createPath,
    expected: 400,
    body: makeValidBook(`${uniqueId} bad id`),
    tags: ["CREATE_FAIL", "TYPE"]
  });

  // ---- T16 LENGTH: id too long (>50 chars) ----
  await test({
    id: "T16",
    name: "Id longer than maximum length",
    method: "POST",
    path: createPath,
    expected: 400,
    body: makeValidBook(`${uniqueId}_${"x".repeat(60)}`),
    tags: ["CREATE_FAIL", "LENGTH"]
  });

  // ---- T17 REQUIRED / UPDATE_FAIL: missing required field on update ----
  await test({
    id: "T17",
    name: "Missing required field (author) on update",
    method: "PUT",
    path: updatePath(uniqueId),
    expected: 400,
    body: { ...makeValidUpdate(), author: undefined },
    tags: ["UPDATE_FAIL", "REQUIRED"]
  });

  // ---- T18 UPDATE_FAIL: update a record that does not exist ----
  await test({
    id: "T18",
    name: "Update non-existent record",
    method: "PUT",
    path: updatePath(`${uniqueId}_doesnotexist`),
    expected: 404,
    body: makeValidUpdate(),
    tags: ["UPDATE_FAIL"]
  });

  // ---- T19 TEMPORAL / BOUNDARY / UPDATE_FAIL: future year on update ----
  await test({
    id: "T19",
    name: "Year in the future on update",
    method: "PUT",
    path: updatePath(uniqueId),
    expected: 400,
    body: { ...makeValidUpdate(), year: currentYear + 3 },
    tags: ["UPDATE_FAIL", "TEMPORAL", "BOUNDARY"]
  });

  // ---- T20 UNKNOWN_CREATE: reject undocumented "currency" field ----
  await test({
    id: "T20",
    name: "Reject undocumented currency field on create",
    method: "POST",
    path: createPath,
    expected: 400,
    body: { ...makeValidBook(`${uniqueId}_t20`), currency: "USD" },
    tags: ["CREATE_FAIL", "UNKNOWN_CREATE"]
  });

  // ---- T21 UNKNOWN_UPDATE: reject undocumented "currency" field ----
  await test({
    id: "T21",
    name: "Reject undocumented currency field on update",
    method: "PUT",
    path: updatePath(uniqueId),
    expected: 400,
    body: { ...makeValidUpdate(), currency: "USD" },
    tags: ["UPDATE_FAIL", "UNKNOWN_UPDATE"]
  });

  // ---- T22 Valid UPDATE (positive path) ----
  await test({
    id: "T22",
    name: "Valid update",
    method: "PUT",
    path: updatePath(uniqueId),
    expected: 200,
    body: makeValidUpdate(),
    tags: []
  });

  // ---- T23 Confirm updated record is retrievable ----
  await test({
    id: "T23",
    name: "Get book after successful update",
    method: "GET",
    path: updatePath(uniqueId),
    expected: 200,
    tags: []
  });

  const pass = logSummary();
  logCoverage();

  process.exit(pass ? 0 : 1);
}

run().catch(err => {
  console.error("ERROR", err);
  process.exit(2);
});
