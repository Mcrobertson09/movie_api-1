const express = require('express');
morgan = require('morgan'),
fs = require('fs'),
path = require('path');

morgan = require('morgan');

const app = express();
const bodyParser = require('body-parser'),
  methodOverride = require('method-override');

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(bodyParser.json());
app.use(methodOverride());

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.use(morgan("common"));
  
app.use('/documentation', express.static('public/documentation.html'));

const accessLogStream = fs.createWriteStream(path.join(__dirname, 'log.txt'), {flags: 'a'})
app.use(morgan('combined', {stream: accessLogStream}));

const repo = require("./repository");

app.get('/', (req, res) => {
  res.send('Movie Collection of the Year!!');
});
  
app.get('/movies', (req, res) => {
    res.json(repo);
});
  
// listen for requests
app.listen(8080, () => {
  console.log('Your app is listening on port 8080.');
});