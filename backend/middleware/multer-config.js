const multer = require('multer'); // On fait appel au module multer. C'est un middleware pour gérer l'envoie de fichiers dans les applications Express. Il est principalement utilisé pour télécharger des fichiers dans un formulaire html sur un serveur (ce qui est notre cas)

const storage = multer.memoryStorage(); //Cette variable définit le type de stockage pour les fichier envoyé. avec multer.memoryStorage(), on permet de stocker les fichiers dans la mémoire du serveur(au lieu d'un répertoire sur le disque).Cela signifie que les fichiers seront stockés temporairement en mémoire.
const upload = multer({ storage }); //La variable upload gère les fichier téléchargé en utilisant la configuration de stockage définie

module.exports = upload.single('image'); //Ici on exporte une version spécifique de middleware de multer qui permet de traiter un seul fichier à la fois. Upload.single('image') signifie que l'on attend un fichier dans le formulaire sous le champ 'image'. Ce middleware sera donc utilisé pour gérer le téléchargement d'un seul fichier dans le champ image d'un formulaire.
