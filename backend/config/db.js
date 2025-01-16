const mongoose = require('mongoose'); //Cette ligne importe la bibliothèque Mongoose qui est utilisé pour interagire avec une base de données MongoDB en Node.js

const connectDB = async () => {
  //Fonction asynchrone pour établir une connexion à la base de données MongoDB
  mongoose.set('strictQuery', false); //ici on configure une option de Mongoose. "strictQuery" est désactivé pour avoir une certaine flexibilité dans la manière dont les requêtes sont effectuées.
  await mongoose
    .connect(process.env.MONGO_URI) // cette méthode établit une connexion à MongoDB. Elle prend en paramètre l'uri de connexion qui est stocké dans une variable d'environnement(process.env.MONGO_URI)
    .then(() => console.log('Connexion à MongoDB réussi')) //Si connexion réussi, message dans la console "Connexion à MongoDB réussi"
    .catch((error) => console.log('Connexion à MongoDB échoué', { error })); // Si connexion échoué, message dans la console avec l'erreur
};

module.exports = connectDB; // On export connectDB pour le rendre accessible par d'autres fichiers
