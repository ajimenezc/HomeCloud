// server.js
import app from './app/app.js';
import dotenv from 'dotenv';


const PORT = process.env.PORT || 3001;
const HOST = process.env.HOST || '0.0.0.0'; // Bind to all network interfaces


// Start the server
app.listen(PORT, HOST, () => {
    console.log(`Server is running on http://${HOST}:${PORT}`);
  });

  app.timeout = 600000;
  app.keepAliveTimeout = 600000; // 10 minutes
  app.headersTimeout = 660000;