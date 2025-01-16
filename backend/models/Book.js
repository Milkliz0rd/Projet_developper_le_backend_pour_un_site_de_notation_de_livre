const mongoose = require('mongoose');

const bookSchema = mongoose.Schema({
  userId: {
    type: String,
    required: true,
    description: "Identifiant MongoDB unique de l'utilisateur",
  },
  title: { type: String, required: true, description: 'Titre du livre' },
  author: { type: String, required: true, description: 'Auteur du livre' },
  imageUrl: {
    type: String,
    description: 'Illustration/couverture du livre',
  },
  year: {
    type: Number,
    required: true,
    description: 'Année de la publication du livre',
  },
  genre: { type: String, required: true, description: 'Genre du livre' },
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
        description: 'Note donnée à un livre',
      },
    },
  ],
  averageRating: {
    type: Number,
    //Mettre un code pour dire que l'on doit recalculer la moyenne à chaque modification de note
    description: 'note moyenne du livre',
  },
});

//Hook pour recalculer la moyenne avant chaque save()
bookSchema.pre('save', function (next) {
  // pre("save") est hook de mongoose. il s'execute avant que le livre soit sauvegarder. Ce hook garantit que la moyenne du livre est recalculé à chaque sauvegarde.
  // l'argument next() sert de fonction de callback. il indique à mongoose que la logique dans le hook est terminé et qu'il peut passer à la prochaine étape (ici sauvegarder le livre)
  if (this.ratings && this.ratings.length > 0) {
    //this fait référence au livre en cours de sauvegarde
    //this.rating vérfie que le tableau ratings existe
    //this.rating.length > 0 vérifie que le tableau contient au moins une note)
    const totalRating = this.ratings.reduce((acc, r) => acc + r.grade, 0);
    //On utilise la methode JS reduce pour parcourir le tableau et accumuler une valeur
    //Ici on calcule la somme de toute les notes (grade) dans le tableau du livre en cours (this.rating)
    //l'argument acc est l'accumulateur (la sommes des notes calculé jusqu'à présent)
    //l'argument r est l'élément courant (la note que nous sommes sur le moment d'enregistrer)
    //r.grade accède donc à la note dans notre tableau
    //0 est la valeur initial de notre acc
    //ex: Si this.rating vaut [{userId:"abc", grade: 4},{userId:"123", grade: 5}]
    // première itération: acc=0, r.grade=4 => acc = 0 + 4 = 4
    // deuxième itération: acc=4, r.grade=5 => acc = 4 + 5 = 9
    // au final, totalRating = 9
    this.averageRating = totalRating / this.ratings.length;
    //Enfin, pour faire une moyenne on divise notre totalRatin par le nombre de note que l'on a sur ce livre
    // dans notre exemple : si totalRating = 9 et this.rating.length = 2 alors this.averageRating: 9 / 2 = 4.5
  }
  next();
  // Une fois que averageRating est calculé on appelle next() pour indiquer à Mongoose que le hook est terminé
});

//Hook pour recalculer la moyenne après l'update
bookSchema.pre('findOneAndUpdate', function (next) {
  //Ce hook mongoose "pre("findOneAndUpdate") est déclanché avant qu'une requête findOneAndUpdate soit exécutée. Ici notre fonction va calculer automatiquement averageRating si le tableau ratings est mise à jour dans la requête.
  // l'argument next() sert de fonction de callback. il indique à mongoose que la logique dans le hook est terminé et qu'il peut passer à la prochaine étape (ici mettre à jour le livre)
  const update = this.getUpdate();
  // cette methode retourne un objet contenant des données mise à jour envoyées par la requête.
  if (update.$set && update.$set.ratings) {
    //update.$set vérifie si l'opération de maj contient un opérateur $set, qui remplace les champs spécifiés dans notre livre
    //update.$set.ratings vérifie si le tableau ratings fait partie de la mise à jour.
    // si les deux conditions sont vraies, alors le tableau ratings est sur le point d'être modifié.
    const ratings = update.$set.ratings;
    //récupère le tableau ratings depuis update.$set.ratings
    if (ratings.length > 0) {
      // vérifie que le tableau contient au moins une note. sinon la moyenne sera fixé à zéro (else)
      const totalRating = ratings.reduce((acc, r) => acc + r.grade, 0);
      //On utilise la methode JS reduce pour parcourir le tableau et accumuler une valeur
      //Ici on calcule la somme de toute les notes (grade) dans le tableau du livre en cours (this.rating)
      //l'argument acc est l'accumulateur (la sommes des notes calculé jusqu'à présent)
      //l'argument r est l'élément courant (la note que nous sommes sur le moment d'enregistrer)
      //r.grade accède donc à la note dans notre tableau
      //0 est la valeur initial de notre acc
      //ex: Si this.rating vaut [{userId:"abc", grade: 4},{userId:"123", grade: 5}]
      // première itération: acc=0, r.grade=4 => acc = 0 + 4 = 4
      // deuxième itération: acc=4, r.grade=5 => acc = 4 + 5 = 9
      // au final, totalRating = 9
      update.$set.averageRating = totalRating / ratings.length;
      //Ajoute ou met à jour le champ averageRating dans les données mise à jour.
      //Enfin, pour faire une moyenne on divise notre totalRatin par le nombre de note que l'on a sur ce livre
      // dans notre exemple : si totalRating = 9 et this.rating.length = 2 alors this.averageRating: 9 / 2 = 4.5
    }
  }
  next();
  //on appelle next() pour indiquer à Mongoose que le hook est terminé
});

module.exports = mongoose.model('Books', bookSchema);
