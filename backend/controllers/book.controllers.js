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

module.exports.addRating = async (req, res) => {
  const { userId, rating } = req.body;

  // Vérifiez que la note est valide
  if (rating < 0 || rating > 5) {
    return res.status(400).json({ message: "La note doit être entre 0 et 5." });
  }

  Book.findOne({ _id: req.params.id })
    .then((book) => {
      if (!book) {
        return res.status(404).json({ message: "Livre non trouvé." });
      }

      // Vérifiez si l'utilisateur a déjà noté le livre
      const existingRating = book.ratings.find((r) => r.userId === userId);
      if (existingRating) {
        return res.status(400).json({ message: "Vous avez déjà noté ce livre." });
      }

      // Ajoutez la nouvelle note
      book.ratings.push({ userId, grade: rating });

      // Recalculez la note moyenne
      const totalRating = book.ratings.reduce((acc, r) => acc + r.grade, 0);
      book.averageRating = totalRating / book.ratings.length;

      // Sauvegardez le livre
      book
        .save()
        .then(() => res.status(200).json(book))
        .catch((error) => res.status(400).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
}

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
