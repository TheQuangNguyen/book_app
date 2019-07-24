'use strict';

// #region ---------- SETUP


const express = require('express');
const app = express();
const superagent = require('superagent');
const PORT = process.env.PORT || 3000;
require('dotenv').config();
const pg = require('pg');
const client = new pg.Client(process.env.DATABASE_URL);
client.connect();

app.set('view engine', 'ejs');

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));



app.listen(PORT, () => {
  console.log('Listening on PORT: ', PORT);
})


// #endregion SETUP


function Book(info, userShelf) {
  this.author = info.volumeInfo.authors || ['Author not available'];
  this.title = info.volumeInfo.title || 'Title not available';
  this.isbn = info.volumeInfo.industryIdentifiers[1] ? `${info.volumeInfo.industryIdentifiers[1].type} ${info.volumeInfo.industryIdentifiers[1].identifier}` : `${info.volumeInfo.industryIdentifiers[0].type} ${info.volumeInfo.industryIdentifiers[0].identifier}`;
  this.image_url = info.volumeInfo.imageLinks ? info.volumeInfo.imageLinks.thumbnail.replace(/^http:\/\//i, 'https://') : 'https://i.imgur.com/J5LVHEL.jpg';
  this.description = info.volumeInfo.description || 'Description not available';
  this.bookshelf = userShelf;
}

Book.prototype.saveToPSQL = function() { 
  const SQL = `
    INSERT INTO books
      (author, title, isbn, image_url, description, bookshelf)
      VALUES($1,$2,$3,$4,$5,$6);`;
  const values = [this.author.join(', '), this.title, this.isbn, this.image_url, this.description, this.bookshelf];
  client.query(SQL, values);
}


// #region ---------- ROUTE 

app.get('/', getHomePage);
app.get('/search', getSearchPage);
app.post('/search', handleSearches);



// #region ---------- ROUTE HANDLERS

function handleSearches(req, res) {
  let url = 'https://www.googleapis.com/books/v1/volumes?q=';
  // check if title or author is selected
  let search = req.body.search[0].replace(/\s/g, '+');
  if (req.body.search[1] === 'title') { url += `+intitle:${search}`; }
  if (req.body.search[1] === 'author') { url += `+inauthor:${search}`; }
  console.log(url);
  superagent.get(url)
    .then(result => result.body.items.slice(0, 10).map(bookInfo => new Book(bookInfo, 'test')))
    .then(bookArr => res.render('pages/searches/show', { searchResults: bookArr }))
    .catch(err => res.render('pages/error', { error: err }));
}

function getSearchPage(req, res) { 
  res.render('pages/searches/new');
}

function getHomePage(req, res) {
  getAllBooks().then(result => {
    res.render('./pages/index', {collection: result.rows})});
}

app.get('*', (req, res) => res.status(404).send('Error. This route does not exist!!!'));

// #endregion ROUTE HANDLERS


// #region HELPER FUNCTIONS

function getAllBooks(option, value) { 
  const SQL = `SELECT * FROM books`;
  return client.query(SQL);
}


