// On importe le module 'express' qui permet de gérer facilement les requêtes HTTP.
const express = require('express');

// On importe les contrôleurs pour les actions de création d'utilisateur et de connexion,
// qui sont définis dans le fichier 'user.controllers.js' situé dans le répertoire parent.
const { createUser, login } = require('../controllers/user.controllers');

// Création d'un routeur Express qui permet de gérer les routes HTTP de manière modulaire.
const router = express.Router();

// Définition de la route POST pour l'inscription (signup).
// Lorsqu'une requête POST est envoyée à l'URL '/signup', la fonction 'createUser'
// est appelée pour gérer la logique de création d'un nouvel utilisateur.
router.post('/signup', createUser);

// Définition de la route POST pour la connexion (login).
// Lorsqu'une requête POST est envoyée à l'URL '/login', la fonction 'login'
// est appelée pour gérer la logique de connexion de l'utilisateur existant.
router.post('/login', login);

// Exportation du routeur pour l'utiliser dans d'autres fichiers .
module.exports = router;
