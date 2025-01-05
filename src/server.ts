
import config from './config.js';
import app from './index.js';


// Start the server
const port = config.express.port;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

export default app;
