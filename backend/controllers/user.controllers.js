const User = require('../models/User'); //importe le modèle User définit dans "../models/User"
const bcrypt = require('bcrypt'); // Importe la bibliothèque bcrypt utilisé pour hasher(chiffrer) les mdp avant de les stocker dans la base de données et pour comparer les mots de passes lors da la connexion.
const jwt = require('jsonwebtoken'); // Bibliothèque utilisé pour créer et gérer des tokens jwt, qui permettent d'authentifier les utilisateurs

module.exports.createUser = async (req, res) => {
  // fonction qui sera appélé pour créer un nouvel utilisateur
  bcrypt
    .hash(req.body.password, 10) //hache le mot de passe reçu dans req.body.password avec un "sel" de 10 tours pour renforcer la sécurité
    .then((hash) => {
      const user = new User({
        // si le hachage réussi alors le mdp chiffré est accessible dans hash
        email: req.body.email,
        password: hash,
      }); // Ici on crée un nouvel utilisateur en utilisant le modèle User
      user
        .save() // On le sauvegarde dans le base de données
        .then(() => res.status(201).json({ message: 'utilisateur créé' })) //si sauvegarde réussi
        .catch((error) => res.status(400).json({ message: error })); // si sauvegarde échoué
    })
    .catch((error) => res.status(500).json({ message: error })); //si le Hachage échoue
};

module.exports.login = async (req, res) => {
  // Fonction qui va géré la connexion des utilisateurs existants
  User.findOne({ email: req.body.email }) // Recherche dans notre base de données l'utilisateur avec l'email fourni dans "req.body.email"
    .then((user) => {
      // si la recherche réussit, l'utilisateur trouvé est stocké dans le paramètre user.
      if (user === null) {
        return res
          .status(401)
          .json({ message: 'Paire identifiant/Mot de passe incorrecte' }); //Si aucun utilisateur est trouvé, on renvoie une erreur avec un message flou pour éviter de savoir si le problème viens du mdp ou du mail (évite les problèmes de piratage).
      } else {
        bcrypt
          .compare(req.body.password, user.password) // sinon, on compare le mdp fourni avec le mdp chiffré dans la base de données
          .then((valid) => {
            if (!valid) {
              return res
                .status(401)
                .json({ message: 'Paire identifiant/Mot de passe incorrecte' }); //Si ce n'est pas le bon mdp, on renvoie une erreur avec un message flou pour éviter de savoir si le problème viens du mdp ou du mail (évite les problèmes de piratage).
            } else {
              return res.status(200).json({
                userId: user._id,
                token: jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
                  expiresIn: '24h',
                }), //Si la comparaison est valide et que l'utilisateur est authentifier on gènère un Token avec JWT. Cela sert de carte d'accès du site. Ce token contient l'id de l'utilisateur plus une clé secrète "RANDOM_TOKEN_SECRET" pour une durée de 24h
              });
            }
          })
          .catch((error) => res.status(500).json({ message: error })); // si il y a une erreur lors de la comparaison des mots de passe
      }
    })
    .catch((error) => res.status(500).json({ message: error })); // si il y a une erreur lors de la recherche de l'utilisateur.
};
