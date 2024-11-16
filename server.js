// server.js
import app from './app/app.js';

const port = 3001; // Define the port

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
