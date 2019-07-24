// 'use strict';
console.log('got in js');

function addBookHandler(event) {
  $('#addBookForm').show();
  const title = $(event.target).siblings('.title').text();
  const author = $(event.target).siblings('.author').text();
  const isbn = $(event.target).siblings('.isbn').text();
  const description = $(event.target).siblings('.description').text();
  const image_url = $(event.target).siblings('.image_url').attr('src');

  const formArray = [title, author, isbn, image_url];
  const nameArray = ['title', 'author', 'isbn','image_url'];
  // console.log($('#addBookForm').children()[0]);
  for (let i = 0; i < formArray.length; i++) {
    $('#addBookForm').children(`.${nameArray[i]}`).attr('value', `${formArray[i]}`);
  }
  $('#addBookForm').children(`.description`).text(`${description}`);
}


$('button[class="select-book"]').click(event, addBookHandler);




