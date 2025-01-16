// On importe le fichier `app.js` qui contient la configuration de l'application Express.
const app = require('../app/app.js');

// On importe la fonction `connectDB` qui permet de se connecter à la base de données MongoDB.
const connectDB = require('../config/db.js');

// On importe dotenv pour charger les variables d'environnement du fichier `.env`.
const dotenv = require('dotenv');

// On charge les variables d'environnement contenues dans le fichier `.env` à l'aide de `dotenv.config()`.
dotenv.config();

// Définition du port sur lequel le serveur va écouter. Ici, c'est le port 4000.
const port = 4000;

// On appelle la fonction `connectDB` pour établir la connexion avec la base de données.
connectDB();

// On démarre le serveur Express avec la méthode `listen()`.
// Le serveur écoute sur le port spécifié, et une fois démarré, il affiche un message dans la console.
app.listen(port, () => {
  console.log(`le serveur a démarré sur http://localhost:${port}`);
});
