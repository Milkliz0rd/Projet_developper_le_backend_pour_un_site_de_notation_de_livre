const Book = require('../models/Book');

async function bookValidator(req, res, next) {
  const bookObject = JSON.parse(req.body?.book || '{}');

  delete bookObject._id;
  delete bookObject._userId;
  const book = new Book(bookObject);

  try {
    await book.validate();
    return next();
  } catch (error) {
    return next(error.message);
  }
}

module.exports = bookValidator;
