const mongoose = require("mongoose");

const bookSchema = mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true,
    description: "Identifiant MongoDB unique de l'utilisateur",
  },
  title: { type: String, required: true, description: "Titre du livre" },
  author: { type: String, required: true, description: "Auteur du livre" },
  imageUrl: {
    type: String,
    required: true,
    description: "Illustration/couverture du livre",
  },
  year: {
    type: Number,
    required: true,
    description: "Année de la publication du livre",
  },
  genre: { type: String, required: true, description: "Genre du livre" },
  ratings: [
    {
      userId: {
        type: String,
        required: true,
        description:
          "Identifiant MongoDB unique de l'utilisateur qui a noté le livre",
      },
      grade: {
        type: Number,
        requirerd: true,
        description: "Note donnée à un livre",
      },
    },
  ],
  averageRating: { type: Number, description: "note moyenne du livre" },
});

module.exports = mongoose.model("Books", bookSchema);
