'use strict';

const express = require('express');
const app = express();
const superagent = require('superagent');
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.use(express.static('public'));

app.get('/', (req, res) => { 
  res.render('./pages/index');
})

app.get('*', (req, res) => res.status(404).send('Error. This route does not exist!!!'));

app.listen(PORT, () => { 
  console.log('Listening on PORT: ', PORT);
})
