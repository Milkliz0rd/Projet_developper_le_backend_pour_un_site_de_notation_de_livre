const express = require("express");
const cors = require("cors");
const path = require("path")
const app = express();

//Middleware pour les cors afin d'accepter les données d'un autre server
app.use(cors());
//Middleware pour parser les données en Json
app.use(express.json());
//Middleware pour gérer des formulaire encodés
app.use(express.urlencoded({ extended: false }));
//Middleware pour journaliser les requêtes
app.use((req, res, next) => {
  console.log(`Requête reçue : ${req.method} ${req.url}`);
  next();
});
//Middleware pour définir les routes
app.use("/api/books", require("../routes/book.routes"));
app.use("/api/auth", require("../routes/user.routes"));
app.use("/images", express.static(path.join(__dirname, '../images')))
//Middleware pour gérer les routes inexistantes
app.use((req, res) => {
  res.status(404).json({ error: "Route non trouvé" });
});

module.exports = app;
