DROP TABLE IF EXISTS books, bookshelves;

CREATE TABLE books (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255),
  author VARCHAR(255),
  isbn VARCHAR(255),
  image_url VARCHAR(255),
  "description" TEXT,
  bookshelf VARCHAR(255)
);

INSERT INTO books (title, author, isbn, image_url, description, bookshelf) VALUES (
 'Dune',
 'Frank Herbert',
 'ISBN_13 9780441013593',
 'http://books.google.com/books/content?id=B1hSG45JCX4C&printsec=frontcover&img=1&zoom=5&edge=curl&source=gbs_api
http://books.google.com/books/content?id=B1hSG45JCX4C&printsec=frontcover&img=1&zoom=5&edge=curl&source=gbs_api
',
 'Paul Atreides, treacherous planet',
 'Fantasy'
);

INSERT INTO books (title, author, isbn, image_url, description, bookshelf) VALUES (
 'What Alice Forgot',
 'Liane Moriarty',
 'ISBN_13 1101515376',
 'http://books.google.com/books/content?id=8iBGzeqj45YC&printsec=frontcover&img=1&zoom=5&edge=curl&source=gbs_api
http://books.google.com/books/content?id=8iBGzeqj45YC&printsec=frontcover&img=1&zoom=5&edge=curl&source=gbs_api
',
 'Alice has a good time.',
 'Fiction'
);