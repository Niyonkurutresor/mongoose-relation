const express = require('express');
const bodyParser = require('body-parser')


const app = express();
app.use(bodyParser.urlencoded({extedn:false}));




// Require Mongoose
const mongoose = require('mongoose');

// Define the Schema for the first model
const authorSchema = new mongoose.Schema({
  name: String,
  books: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Book' }],
});

// Define the Schema for the second model
const bookSchema = new mongoose.Schema({
  title: String,
  authors: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Author' }],
});

// Define the Schema for the third model
const authorBookSchema = new mongoose.Schema({
  authorId: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Author' }],
  bookId: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Book' }],
  date: { type: Date, default: Date.now },
});

// Define the models for each schema
const Author = mongoose.model('Author', authorSchema);
const Book = mongoose.model('Book', bookSchema);
const AuthorBook = mongoose.model('AuthorBook', authorBookSchema);

// Create a new author
const author = new Author({
  name: 'John Doe',
});

// Create a new book
const book = new Book({
  title: 'The Great Gatsby',
});

// Create a new author-book relation
const authorBook = new AuthorBook({
  authorId: author._id,
  bookId: book._id,
});

// Save the models to the database
author.save();
book.save();
authorBook.save();

// Add the book to the author's books array
author.books.push(book._id);
author.save();

// Add the author to the book's authors array
book.authors.push(author._id);
book.save();

// Populate the author-book relation
AuthorBook.find()
  .populate('authorId')
  .populate('bookId')
  .exec(function(err, authorBooks) {
    if (err) {
      console.log(err);
    } else {
      console.log(authorBooks);
    }
  });


  app.listen(6000,()=>{
    console.log('app is runing on port 6000')
  })