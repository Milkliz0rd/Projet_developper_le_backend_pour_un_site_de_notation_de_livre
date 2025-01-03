const Book = require("../models/Book");

module.exports.setBooks = async (req, res) => {
  delete req.body_id;
  const book = new Book({
    ...req.body,
  });
  book
    .save()
    .then((book) => res.status(201).json({ book }))
    .catch(() => res.status(400).json({ Error }));
};

module.exports.getBooks = async (req, res) => {
  Book.findMany()
    .then((Book) => res.status(200).json({ books: Book }))
    .catch((error) => res.status(400).json({ Error }));
};

module.exports.getBook = async (req, res) => {
  Book.findOne({ _id: req.params.id })
    .then((Book) => res.status(200).json({ Book }))
    .catch((error) => res.status(404).json({ Error }));
};

module.exports.getBooksBestRating = async (req, res) => {};

module.exports.updateBooks = async (req, res) => {
  Book.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
    .then(() => res.status(200).json({ message: "Livre modifié !" }))
    .catch((error) => res.status(400).json({ Error }));
};

module.exports.removeBooks = async (req, res) => {
  Book.deleteOne({ _id: req.params.id })
    .then(() => res.status(200).json({ message: "Livre supprimé !" }))
    .catch((error) => res.status(400).json({ Error }));
};
module.exports.updatePosts;
