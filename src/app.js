const express = require("express");
const path = require("path");
const mustacheExpress = require('mustache-express');
const JOBS = require('./jobs');

const app = express();

app.use(express.static(path.join(__dirname,'public')));

//express mustache config
app.set('views', path.join(__dirname, 'pages'));
app.set('view engine', 'mustache');
app.engine('mustache', mustacheExpress());

app.get('/',(req, res)   => {
    res.render('index', {jobs: JOBS});
});

app.get('/jobs/:id', (req, res) => {
    const id = req.params.id;
    const matchedJob = JOBS.find(job => job.id.toString() === id);
    res.render('job', {job: matchedJob});
});

app.post('/jobs/:id/apply', (req, res) => {
    res.send("Got the application");
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});