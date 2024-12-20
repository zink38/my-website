#!/usr/bin/env node

import app from './index.js';
import config from './config.js';

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

// Handle shutdown signals
// const shutdown = () => {
//   server.close(() => {
//     console.log('Server shut down gracefully');
//     process.exit(0);
//   });
// };

// process.on('SIGINT', shutdown); // Handle Ctrl+C (SIGINT)
// process.on('SIGTERM', shutdown); // Handle termination (SIGTERM)

// process.on('uncaughtException', (error) => {
//   console.error('Uncaught Exception:', error);
//   shutdown();
// });
