// 'use strict';
console.log('got in js');

function addBookHandler(event) {
  $('#addBookForm').show().fadeIn(500);
  $('input[name="_method"]').attr('value','test');
  $('.dark').show().fadeIn(500);
  $('.closeWindow').click(closeWindow);
  const title = $(event.target).siblings('.title').text();
  const author = $(event.target).siblings('.author').text();
  const isbn = $(event.target).siblings('.isbn').text();
  const description = $(event.target).siblings('.description').text();
  const image_url = $(event.target).siblings('.image_url').attr('src');
  const bookshelf = $(event.target).siblings('.bookshelf').text();

  const formArray = [title, author, isbn, image_url, bookshelf];
  const nameArray = ['title', 'author', 'isbn','image_url', 'bookshelf'];
  // console.log($('#addBookForm').children()[0]);
  for (let i = 0; i < formArray.length; i++) {
    $('#addBookForm').children(`.${nameArray[i]}`).attr('value', `${formArray[i]}`);
  }
  $('#addBookForm').children(`.description`).text(`${description}`);
}

function closeWindow() { 
  $('#addBookForm').hide().fadeOut(500);
  $('.dark').hide().fadeOut(500);
}

$('button[class="select-book"]').click(event, addBookHandler);




