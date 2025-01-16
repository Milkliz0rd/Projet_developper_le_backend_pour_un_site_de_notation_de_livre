const express = require('express'); // Importation du framework express (creéation et gestion de serveur)
const cors = require('cors'); // Importation du module CORS(cross-Origin Resource Sharing), qui permet d'accepter des requêtes provenant de domaines différent de notre serveur
const path = require('path'); // Importation du module path(inclus dans node.js) qui permet de manipuler et de résoudre les chemin de fichiers.
const app = express(); // création d'une app Express

//----------------------------------------Middlewares--------------------------------------------

// Les middlewares sont des fonctions qui gèrent les requêtes et réponses d'une application en tant que tampon entre les deux. Il sont l'intermédiaire entre la reception de la requête et l'envoie de la réponse au client.

app.use(cors()); //Active le module CORS
app.use(express.json()); //Active un middleware intégré à Express pour analyser les requêtes JSON. Cela permet de lire et manipuler les donnés envoyées dans le corps d'une requête "Content-Type: application/json".
app.use((req, res, next) => {
  console.log(`Requête reçue : ${req.method} ${req.url}`);
  next();
}); //Middleware pour journaliser les requêtes dans notre console. Elle affiche la méthode et l'url demandée. Next indique à Express de passer au middleware suivant

//Middleware pour définir les routes
app.use('/api/books', require('../routes/book.routes')); // Toute requête commençant par /api/books sera gérée par les routes définies dans le fichier "../routes/book.routes"
app.use('/api/auth', require('../routes/user.routes')); // Toute requête commançant par "/api/auth" sera gérée par les routes définies dans "../routes/user.routes"
app.use('/images', express.static(path.join(__dirname, '../images'))); //Configure un middleware pour servir des fichiers statiques. Les fichiers du dossier physique "../images" deviennent accessibles publiquement via une url commençant par /images.
// path.join combine ce repertoire "__dirname" avec ../images, pour calculer le chemin absolu du dossier images. Cela permet de garantir une compatibilité entre différents système d'exploitation (macos, windows, linux...)
//__dirname correspond au répertoire actuel où le fichier contenant ce code est executé.
app.use((req, res) => {
  res.status(404).json({ error: 'Route non trouvé' });
}); // Midlleware final qui est appelé si aucune des routes précédentes n'a correspondu.

module.exports = app;
// Exporte l'app d'express afin qu'elle puisse être utilisé dans d'autres fichiers
