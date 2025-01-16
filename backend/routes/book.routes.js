const express = require('express'); // Importation du module express, framework de Node.js qui nous permet de créer notre api
const auth = require('../middleware/auth'); // Importation de notre middleware personnalisé "auth". Verifie si l'utilisateur est authentifier pour utiliser certaines routes
const multer = require('../middleware/multer-config'); // Importation de multer que l'on a configuré dans le fichier "multer-config". Il sera utilisé pour gérer les fichiers envoyé via les requêtes http.
const sharp = require('../middleware/sharp'); // Importation de sharp qui l'on a configuré dans le fichier "sharp". Uitlisé pour compressé et convertir les images envoyées.
const {
  setBooks,
  getBooks,
  updateBooks,
  removeBooks,
  getBook,
  addRating,
  bestRatingsBooks,
} = require('../controllers/book.controllers'); //Importation de nos fonctions de book.controllers
const router = express.Router(); // creation d'un nouvel objet "router", qui permet des gérer les routes spécifique à une ressource.(ici les livres)

router.get('/', getBooks); //Route http get à l'url "/". Permet de récupéré la liste des livres
router.get('/bestrating', bestRatingsBooks); //Route http get à l'url "/bestrating". Permet de récupérer les livres avec la meilleure notation
router.get('/:id', getBook); //Route HTTP GET à l'URL "/:id". Permet de récupérer un livre spécifique en fonction de son id
router.post('/', auth, multer, sharp, setBooks); //Route HTTP POST à l'URL "/". Appelle les middlewares auth (authentification), multer (gestion des fichiers), et sharp (traitement des fichiers) avant d'exécuter la fonction setBooks. Permet de créer un nouveau livre.
router.post('/:id/rating', auth, addRating); //Route HTTP POST à l'URL "/:id/rating".Utilise le middleware auth pour vérifier que l'utilisateur est authentifié avant d'exécuter la fonction addRating, qui ajoute une évaluation au livre.
router.put('/:id', auth, multer, sharp, updateBooks); //Route HTTP PUT à l'URL /:id. Utilise les middlewares auth, multer, et sharp avant d'exécuter la fonction updateBooks, qui met à jour les informations d'un livre existant
router.delete('/:id', auth, removeBooks); //Route HTTP DELETE à l'URL /:id. Utilise le middleware auth avant d'exécuter la fonction removeBooks, qui supprime un livre spécifique.

module.exports = router; //Exporte le router pour qu'il puisse être utilisé dans d'autres parties de l'application, probablement dans le fichier principal de l'API (app.js ou server.js).
