import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import mustacheExpress from 'mustache-express';
import dotenv from 'dotenv';
import homeRouter from './home/router.js'; // Import the home router
import jobsRouter from './jobs/router.js';
//import notFound from './errors/not-found.js'; // Import the not-found middleware


dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '..','public'))); // Ensure this line points to the correct path
console.log(path.join(__dirname,'..', 'public'));




// express mustache config
app.set('views', [
  path.join(__dirname, 'home'), // Home templates
  path.join(__dirname, 'jobs'), // Jobs templates
  path.join(__dirname, 'errors'), // Jobs templates
]);
console.log(app.get('views'));

app.set('view engine', 'mustache');
app.engine('mustache', mustacheExpress());

app.use('/', homeRouter); // Use the home router
app.use('/jobs', jobsRouter);

// Error handling middleware
//app.use(notFound);


export default app;
