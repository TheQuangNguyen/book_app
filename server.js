'use strict';

// #region ---------- SETUP


const express = require('express');
const app = express();
const superagent = require('superagent');
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));



app.listen(PORT, () => {
  console.log('Listening on PORT: ', PORT);
})

// #endregion SETUP


function Book(info) {
  this.coverImage = info.volumeInfo.imageLinks.thumbnail.replace(/^http:\/\//i, 'https://') || 'https://i.imgur.com/J5LVHEL.jpg';
  this.title = info.volumeInfo.title || 'Title not available';
  this.authors = info.volumeInfo.authors || ['Author not available'];
  this.summary = info.volumeInfo.description || 'Summary not available'
}


// #region ---------- ROUTE HANDLERS

app.post('/searches', (req, res) => {
  let url = 'https://www.googleapis.com/books/v1/volumes?q=';
  // check if title or author is selected
  let search = req.body.search[0].replace(/\s/g, '+');
  if (req.body.search[1] === 'title') { url += `+intitle:${search}`; }
  if (req.body.search[1] === 'author') { url += `+inauthor:${search}`; }
  console.log(url);
  superagent.get(url)
    .then(result => result.body.items.slice(0, 10).map(bookInfo => new Book(bookInfo)))
    .then(bookArr => res.render('pages/searches/show', { searchResults: bookArr }))
    .catch(err => res.render('pages/error', { error: err }));

});

app.get('/', (req, res) => {
  res.render('./pages/index');
})

app.get('*', (req, res) => res.status(404).send('Error. This route does not exist!!!'));

// #endregion ROUTE HANDLERS


