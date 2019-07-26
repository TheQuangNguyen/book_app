'use strict';

// #region ---------- SETUP


const express = require('express');
const app = express();
const superagent = require('superagent');
const methodOverride = require('method-override');
const PORT = process.env.PORT || 3000;
require('dotenv').config();
const pg = require('pg');
const client = new pg.Client(process.env.DATABASE_URL);
client.connect();

app.set('view engine', 'ejs');

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride((request, response) => {
  if (request.body && typeof request.body === 'object' && '_method' in request.body) {
    let method = request.body._method;
    delete request.body._method;
    return method;
  }
}))

app.listen(PORT, () => {
  console.log('Listening on PORT: ', PORT);
})


// #endregion SETUP


function Book(info, userShelf) {
  this.author = info.volumeInfo.authors ? info.volumeInfo.authors.join(', ') : 'Author not available';
  this.title = info.volumeInfo.title || 'Title not available';
  this.isbn = info.volumeInfo.industryIdentifiers[1] ? `${info.volumeInfo.industryIdentifiers[1].type} ${info.volumeInfo.industryIdentifiers[1].identifier}` : `${info.volumeInfo.industryIdentifiers[0].type} ${info.volumeInfo.industryIdentifiers[0].identifier}`;
  this.image_url = info.volumeInfo.imageLinks ? info.volumeInfo.imageLinks.thumbnail.replace(/^http:\/\//i, 'https://') : 'https://i.imgur.com/J5LVHEL.jpg';
  this.description = info.volumeInfo.description || 'Description not available';
  this.bookshelf = userShelf;
}

Book.saveToPSQL = function (object) {
  console.log('object', (object));
  let { title, author, isbn, image_url, description, bookshelf } = object;
  const SQL = 'INSERT INTO books (author, title, isbn, image_url, description, bookshelf) VALUES($1,$2,$3,$4,$5,$6);';
  const values = [author, title, isbn, image_url, description, bookshelf];
  return client.query(SQL, values);
}

Book.getFromPSQLUsingISBN = function (isbn) {
  const SQL = 'SELECT * FROM books where isbn = $1;';
  return client.query(SQL, [isbn]);
}


// #region ---------- ROUTE 

app.get('/', getHomePage);
app.get('/search', getSearchPage);
app.post('/search', handleSearches);
app.get('/book/:id', getBookDetails);
app.post('/book', handleBookAdd);
app.put('/book/:id', handleBookUpdate);
app.delete('/book/:id', handleBookDelete);


// #region ---------- ROUTE HANDLERS

function handleBookDelete(req, res) {
  console.log('delete this id: ', req.params)
  const SQL = 'DELETE FROM books WHERE id=$1'
  client.query(SQL, [req.params.id])
    .then(result => res.send('happy'));
}



function getBookDetails(req, res) {
  const sql = `SELECT * FROM books WHERE id=${req.params.id};`;
  client.query(sql)
    .then(result => res.render('pages/books/show', { book: result.rows[0] }))
    .catch(err => errorHandling(err, res));
}

function handleBookUpdate(req, res) {
  let { title, author, isbn, image_url, description, bookshelf } = req.body;
  let SQL = `UPDATE books SET title=$1, author=$2, isbn=$3, image_url=$4, description=$5, bookshelf=$6 WHERE id=$7`;
  let values = [title, author, isbn, image_url, description, bookshelf, req.params.id];
  return client.query(SQL, values)
    .then(results => {
      res.redirect('/');
    })
    .catch(err => errorHandling(err, res));
}

function handleBookAdd(req, res) {
  Book.saveToPSQL(req.body)
    .then(result => Book.getFromPSQLUsingISBN(req.body.isbn))
    .then(result => res.render('pages/books/show', { book: result.rows[0] }))
    .catch(err => errorHandling(err, res));
}

function handleSearches(req, res) {
  let url = 'https://www.googleapis.com/books/v1/volumes?q=';
  // check if title or author is selected
  let search = req.body.search[0].replace(/\s/g, '+');
  if (req.body.search[1] === 'title') { url += `+intitle:${search}`; }
  if (req.body.search[1] === 'author') { url += `+inauthor:${search}`; }
  console.log(url);
  superagent.get(url)
    .then(result => result.body.items.slice(0, 10).map(bookInfo => new Book(bookInfo, 'Enter bookshelf')))
    .then(bookArr => res.render('pages/searches/show', { searchResults: bookArr }))
    .catch(err => errorHandling(err, res));
}

function getSearchPage(req, res) {
  res.render('pages/searches/new');
}

function getHomePage(req, res) {
  getAllBooks().then(result => {
    res.render('./pages/index', { collection: result.rows, totalBooks: result.rows.length })
  });
}

app.get('*', (req, res) => res.status(404).send('Error. This route does not exist!!!'));

// #endregion ROUTE HANDLERS


// #region HELPER FUNCTIONS

function getAllBooks(option, value) {
  const SQL = `SELECT * FROM books`;
  return client.query(SQL);
}

function errorHandling(err, res) {
  res.render('pages/error', { error: err });
}


