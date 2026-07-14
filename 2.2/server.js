// Import the Express module so we can create a web server.
const express = require('express');
// Import Node.js's built-in 'path' module to help with file paths.
const path = require('path');
// Create an instance of an Express application.
const app = express();
// Define the port number to listen on.
// It uses an environment variable PORT if provided; otherwise, it defaults to 3000.
const PORT = process.env.PORT || 3000;
// Set up middleware to serve static files from the "public" folder.
// This means that when a request is made to the root URL ("/"),
// Express will look for a file named index.html (or other static assets) inside the "public" directory.
app.use(express.static(path.join(__dirname, 'public')));
// Define a GET endpoint at '/square' that calculates the square of a number.
// The endpoint expects a query parameter 'num', e.g., /square?num=5
app.get('/add', (req, res) => {
 // Extract the 'num' query parameter from the request and convert it to a floating point number.
 const num1 = parseFloat(req.query.num1);

 // Check if 'num' is not a valid number. If it's not, send an error message as the response.
 if (isNaN(num1)) {
 return res.send("Error: Please provide a valid number using query parameter 'num'.");
 }

 const num2 = parseFloat(req.query.num2);

 // Check if 'num' is not a valid number. If it's not, send an error message as the response.
 if (isNaN(num2)) {
 return res.send("Error: Please provide a valid number using query parameter 'num'.");
 }

 // Calculate the square of the number.
 const add = num1 * num2;

 // Send a plain text response showing the result.
 res.send(`The addition is: ${add}`);
});
// Start the server and have it listen on the specified port.
// Once the server is running, log a message to the console indicating where it's accessible.
app.listen(PORT, () => {
 console.log(`Server is running on http://localhost:${PORT}`);
});