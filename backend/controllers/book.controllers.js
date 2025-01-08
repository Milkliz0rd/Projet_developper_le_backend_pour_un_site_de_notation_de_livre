const fs = require("fs")
const Book = require("../models/Book");


module.exports.setBooks = async (req, res) => {
  const bookObject = JSON.parse(req.body.book);
  delete bookObject._id;
  delete bookObject._userId;
  const book = new Book({
    ...bookObject,
    userId: req.auth.userId,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
    ratings: [],
    averageRating: 0,
  });
  book
    .save()
    .then(() => res.status(201).json({ message:"Livre enregistré !" }))
    .catch((error) => res.status(400).json({ error }));
};

module.exports.getBooks = async (req, res) => {
  Book.find()
    .then((books) => res.status(200).json( books ))
    .catch((error) => res.status(400).json({ error }));
};

module.exports.getBook = async (req, res) => {
  Book.findOne({ _id: req.params.id })
    .then((book) => res.status(200).json( book ))
    .catch((error) => res.status(404).json({ error }));
};

module.exports.updateBooks = async (req, res) => {
  const bookObject = req.file ? {
    ...JSON.parse(req.body.thing),
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  } : {...req.body}

  delete bookObject._userId;
  Book.findOne({_id: req.params.id})
  .then((Book) => {
    if(Book.userId != req.auth.userId) {
      res.status(401).json({message: "Non-autorisé"})
    }else{
      Book.updateOne({_id: req.params.id}, {...thingObject, _id: req.params.id})
      .then(() => res.status(200).json({message: 'Livre Modifié'}))
      .catch(error => res.status(401).json({error}))
    }
  })
};

module.exports.removeBooks = async (req, res) => {
  Book.findOne({ _id: req.params.id })
    .then((book) => {
      if (book.userId != req.auth.userId){
        res.status(401).json({message: "non autorisé"})
      }else{
        const filename = book.imageUrl.split('/images/')[1]
        fs.unlink(`images/${filename}`, () => {
          Book.deleteOne({_id: req.params.id})
          .then(res.status(200).json({ message: "Livre supprimé !" }))
          .catch(error => res.status(401).json({error}))
        })
      }
    })
    .catch((error) => res.status(500).json({ error }));
};
module.exports.updatePosts;
