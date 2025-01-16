const fs = require('fs');
const Book = require('../models/Book');

// fonction qui va nous permette de créé un livre dans notre base de donnée
module.exports.setBooks = async (req, res) => {
  const bookObject = JSON.parse(req.body.book);
  // req.body.book fait référence au contenu de la requête que l'utilisateur envoit. ici un livre sous forme d'une chaine json
  //JSON.parse tranforme cette chaine json en un objet js Utilisable (bookObject)
  delete bookObject._id;
  // Supprime la propriété _id de l'objet bookObject au cas où il en possède un (il génèrera un id unique avec book.save() )
  delete bookObject._userId;
  // Supprime la propriété _userId de l'objet bookObject au cas il en possède un ( empêche toute manipulation ou usurpation des données utilisateurs de modifier un livre et, par la suite, ce dernier sera généré avec new Book => userId: req.auth.userId)
  const book = new Book({
    // créé un nouveau livre dans notre base de donnée en se basant sur le schema de Book que l'on récupère dans "const Book = require('../models/Book');"
    ...bookObject,
    userId: req.auth.userId,
    imageUrl: req.file
      ? `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
      : '',
    // dans ...bookObject, c'est le spread Operator qui destructure bookObject pour récupéré les propriété à mettre dans le nouvel objet book
    // on défini userId en lui spécifiant que c'est le userId de la personne authentifier qui sera ajouter sur cet ligne
    // si req.file, on définit l'url de l'image associée au livre. elle est construite à partir des élément suivants:
    // req.protocol: Protocole utilisé (http ou https),
    // req.get('host'): récupère le nom de l'hôte (ex: localhost:4000),
    // req.file.filname: nom du fichier télécharger (généré par multer),
    // sinon, on applique une chaine caractère vide
  });
  book
    .save()
    //enregistre l'objet book dans la base de données
    .then(() => res.status(201).json({ message: 'Livre enregistré !' }))
    .catch((error) => res.status(400).json({ error }));
  // gestion des résultats, .then la création (status 201) à réussi donc on renvoie une réponse avec un message de succès
  // .catch si une érreur survient, on envoie une réponse status 400 (requête incorrect) avec un message d'erreur.
};

//---------------------------------------------------------------

// fonction qui va nous permettre de récupérer tous les livres dans notre base de donnée
module.exports.getBooks = async (req, res) => {
  Book.find()
    // On utilise la méthode find() de mongoose pour chercher le tableau entier de Book car aucun critère n'est définit
    .then((books) => res.status(200).json(books))
    // Une fois la promesse de find() est résolue (tous les livres sont récupérés), on applique la methode then() qui nous renvoie à notre tableau books sous forme json
    .catch((error) => res.status(400).json({ error }));
  // Si une erreur se produit pendant l'execution de book.find(), la méthode catch est excutée, celle ci nous renvoie à un status 400 (bad request) et nous transmet en format json l'erreur dans la réponse http
};

//--------------------------------------------------------------

// Fonction qui va nous permettre de récupéré un livre en particulier par rapport à son _id
module.exports.getBook = async (req, res) => {
  Book.findOne({ _id: req.params.id })
    //Ici on utilise la méthode findOne de mongoose pour rechercher un document qui correspon au critère _id: req.params.id définit dans le schema de Book
    // req.params.id récupère l'identifiant du livre depuis les paramètres d'URL de la requête (par exemple, si l'URL est /books/123, req.params.id vaudra 123)
    .then((book) => res.status(200).json(book))
    // Une fois la promesse de findOne() est résolue (le livres en particulié est récupéré), on applique la methode then() qui nous renvoie à notre livre (book)
    .catch((error) => res.status(404).json({ error }));
  // Si une erreur se produit pendant l'execution de book.findOne(), la méthode catch est excutée, celle ci nous renvoie à un status 404 (non trouvé) et nous transmet en format json l'erreur dans la réponse http
};

//--------------------------------------------------------------

// fonction qui va nous permettre de noté les livres des autres utilisateurs
module.exports.addRating = async (req, res) => {
  const { userId, rating } = req.body;
  // On extrait les propriétées userId et rating de la requête (req.body)
  Book.findOne({ _id: req.params.id })
    //Ici on utilise la méthode findOne de mongoose pour rechercher un document qui correspon au critère _id: req.params.id définit dans le schema de Book
    .then((book) => {
      // si la recherche réussi, le promesse résolue contient un objet book, correspondant au livre que l'on a trouvé dans notre base de donnée.
      const existingRating = book.ratings.find((r) => r.userId === userId);
      // on cherche dans le tableau d'évaluation de notre livre, si le user id qui souhaite noté ce livre s'y trouve déjà.
      if (existingRating) {
        return res
          .status(400)
          .json({ message: 'Vous avez déjà noté ce livre.' });
        // Si il existe déjà on, renvoie à un status 400 (bas request) avec un message en format json donné dans la réponse.
      } else {
        book.ratings.push({ userId, grade: rating });
        // sinon, un nouvelle objet userId, grade:rating est ajouté au tableau avec push
        book
          .save()
          // methode save pour enregistrer les modifications apportées à la base de donnée
          .then((book) => res.status(200).json(book))
          //Si l'enregistrement réussit, une réponse HTTP avec le code 200 (OK) est envoyée, accompagnée du document book mis à jour
          .catch((error) => res.status(400).json({ error }));
        //Si une erreur se produit lors de la sauvegarde, une réponse HTTP avec le code 400 (Mauvaise requête) est envoyée, accompagnée de l'erreur
      }
    })
    .catch((error) => res.status(404).json({ error }));
  // Si une erreur se produit lors de la méthode findOne() on nous envoie un status 404 (non trouvé) et on nous transmet en format json cette dernière dans la réponse http
};

//-----------------------------------------------------------------

// fonction qui nous permet d'avoir les 3 livres aillant la meilleure note sur notre base de donnée
module.exports.bestRatingsBooks = async (req, res) => {
  Book.find()
    // On utilise la méthode find() de mongoose pour chercher le tableau entier de Book car aucun critère n'est définit
    .sort({ averageRating: -1 })
    // On utilise la méthode sort() avec la propriété averageRating pour identifier que le tri va se faire ici et le -1 indique qui c'est un tri descendant (plus élévé > plus faible)
    .limit(3)
    // on utilise la methode limit(3) pour dire que seulement les 3 meilleurs notes seront affiché dans notre réponse
    .then((books) => res.status(200).json(books))
    // Une fois la promesse de find() est résolue (tous les livres sont récupérés) et que les opérations de tri et de limitation on réussi, on applique la methode then() qui nous renvoie à notre tableau books sous forme json
    .catch((error) => res.status(400).json({ error }));
  // Si une erreur se produit pendant l'execution de book.find() ou l'execution de sort() ou l'execution de limit(), la méthode catch est excutée, celle ci nous renvoie à un status 400 (bad request) et nous transmet en format json l'erreur dans la réponse http
};

//-------------------------------------------------------------------

//Fonction qui va nous permettre de modifier nos livres dans notre base de donnée
module.exports.updateBooks = async (req, res) => {
  Book.findOne({ _id: req.params.id })
    // requête mongoDB qui cherche un document unique dans la collection Book de la base de données. La recherche est basé sur la valeur ID reçu dans les paramètre de l'url(req.params.id).
    .then((book) => {
      if (book.userId != req.auth.userId) {
        return res.status(401).json({ message: 'Non-autorisé' });
      }
      //si le livre est trouvé alors on renvoie à une condition qui nous dit, si l'userId de la personne qui a créé le livre est différent de celui qui fait est actuellement authentifier (req.auth.userId) alors on refuse l'accès et on renvoie un status 401
      if (req.file) {
        // Si on reçoit une requête avec un fichier
        const filename = book.imageUrl.split('/images/')[1];
        // cette ligne extrait le nom du fichier d'image associé au livre :
        //book.imageUrl est supposé être l'url de l'image stocké (ex: "http://localhost:4000/images/1736494486158.webp" )
        // split va séparer cette url en deux parties, la partie avant /images/ et la partie après /images/
        // [1] correspond à la partie que l'on veut, c'est à dire celle après /images/
        fs.unlink(`images/${filename}`, (err) => {
          if (err) console.error(err);
        });
        // la méthode fs.unlink() est utilisée pour supprimer le fichier d'image du dossier local images.
        // le chemin est construit dynamiquement avec le nom du fichier extrait avec filename
        // une fois supprimer la fonction de rappel associé est exécutée (ici pour la gestion des erreurs)
      }
      const bookObject = req.file
        ? {
            ...JSON.parse(req.body.book),
            imageUrl: `${req.protocol}://${req.get('host')}/images/${
              req.file.filename
            }`,
          }
        : //req.file correspond à "si un objet est envoyé dans la requête"
          //JSON.parse(req.body.book) correspond à "si un fichier est présent, on parse l'objet book envoyé dans la requête pour le convertir de chaine JSON à un objet JS "
          //On génère l'url complète de l'image en utilisant:
          // req.protocol: Protocole utilisé (http ou https)
          // req.get('host'): récupère le nom de l'hôte (ex: localhost:4000)
          // req.file.filname: nom du fichier télécharger (généré par multer)
          { ...req.body };
      // sinon, on copie directement le contenu de req.body dans bookObject.
      delete bookObject._userId;
      // on supprime la propriété _userId de l'objet bookObject pour empêcher un utilisateur de modifier cet identifiant
      Book.updateOne(
        { _id: req.params.id },
        //on fait une requête mongoDB qui met à jour le livre en question (Book.updateOne)
        { ...bookObject, _id: req.params.id }
        // On met à jour le livre avec les données de bookObject tout en conservant son id.
      )
        .then(() => res.status(200).json({ message: 'Livre Modifié' }))
        .catch((error) => res.status(401).json({ error }));
      // gestion des résultats, .then la maj à réussi donc on renvoie une réponse avec un message de succès
      // .catch si une érreur survient, on envoie une réponse status 401 avec un message d'erreur.
    });
};

//--------------------------------------------------------------------------

//Fonction qui va nous permettre de supprimer un livre de notre base de données
module.exports.removeBooks = async (req, res) => {
  Book.findOne({ _id: req.params.id })
    // requête mongoDB qui cherche un document unique dans la collection Book de la base de données. La recherche est basé sur la valeur ID reçu dans les paramètre de l'url(req.params.id).
    .then((book) => {
      if (book.userId != req.auth.userId) {
        res.status(401).json({ message: 'non autorisé' });
        //si le livre est trouvé alors on renvoie à une condition qui nous dit, si l'userId de la personne qui a créé le livre est différent de celui qui fait est actuellement authentifier (req.auth.userId) alors on refuse l'accès et on renvoie un status 401
      } else {
        const filename = book.imageUrl.split('/images/')[1];
        // cette ligne extrait le nom du fichier d'image associé au livre :
        //book.imageUrl est supposé être l'url de l'image stocké (ex: "http://localhost:4000/images/1736494486158.webp" )
        // split va séparer cette url en deux parties, la partie avant /images/ et la partie après /images/
        // [1] correspond à la partie que l'on veut, c'est à dire celle après /images/
        fs.unlink(`images/${filename}`, () => {
          // la méthode fs.unlink() est utilisée pour supprimer le fichier d'image du dossier local images.
          // le chemin est construit dynamiquement avec le nom du fichier extrait avec filename
          // une fois supprimer la fonction de rappel associé est exécutée
          Book.deleteOne({ _id: req.params.id })
            // la methode deleteOne de mongoDB supprime le doc correspondant dans la base de donnée Book, en utilisant l'id reçu dans req.params.id
            .then(res.status(200).json({ message: 'Livre supprimé !' }))
            .catch((error) => res.status(401).json({ error }));
          // gestion des résultats, .then la suppression à réussi donc on renvoie une réponse avec un message de succès
          // .catch si une érreur survient, on envoie une réponse status 401 avec un message d'erreur.
        });
      }
    })
    .catch((error) => res.status(500).json({ error }));
  // gestion d'erreur si une erreur se produit lors de la recherche du livre avec FindOne
};
module.exports.updatePosts;
