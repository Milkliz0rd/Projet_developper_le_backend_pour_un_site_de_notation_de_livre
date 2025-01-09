const mongoose = require("mongoose");

const bookSchema = mongoose.Schema({
  userId: {
    type: String,
    required: true,
    description: "Identifiant MongoDB unique de l'utilisateur",
  },
  title: { type: String, required: true, description: "Titre du livre" },
  author: { type: String, required: true, description: "Auteur du livre" },
  imageUrl: {
    type: String,

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
  averageRating: { type: Number, 
    //Mettre un code pour dire que l'on doit recalculer la moyenne à chaque modification de note
    description: "note moyenne du livre" },
});

//Hook pour recalculer la moyenne avant chaque save()
bookSchema.pre("save", (next) => {
if (this.rating && this.rating.length > 0) {
  const totalRating = this.rating.reduce((acc, r) => acc + r.grade, 0)
  this.averageRating = totalRating / this.rating.length
}else{
  this.averageRating = 0
}
next()
})

//Hook pour recalculer la moyenne après l'update
bookSchema.pre("findOneAndUpdate", function (next) {
  const update = this.getUpdate();
  if (update.$set && update.$set.ratings) {
    const ratings = update.$set.ratings;
    if (ratings.length > 0) {
      const totalRating = ratings.reduce((acc, r) => acc + r.grade, 0);
      update.$set.averageRating = totalRating / ratings.length;
    } else {
      update.$set.averageRating = 0;
    }
  }
  next();
});

module.exports = mongoose.model("Books", bookSchema);
