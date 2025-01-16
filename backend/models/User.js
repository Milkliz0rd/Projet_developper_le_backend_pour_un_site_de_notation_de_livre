const mongoose = require('mongoose'); // Importe la bibliothèque mongoose qui permet d'interagir avec MongoDB
const uniqueValidator = require('mongoose-unique-validator'); // Ici, on importe le plugin mongoose-unique-validator afin de valider que les champs unique (email pour notre cas), sont vraiment uniques dans la base de données. Il rajoute une validation pour garantir qu'un champ défini comme "unique: true" ne contient pas de doublons.

const userSchema = mongoose.Schema({
  //On crée un schéma de Mongoose, qui définit la structure des documents dans la collection MongoDB des utilisateurs.
  email: {
    type: String,
    validate: {
      validator: (v) =>
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(v),
      message: (s) => `${s.value} is not a valid email`,
    }, // Ici on valide si l'email est dans un bon format ou non et on envoie un message d'erreur si non.
    required: [true, "l'email est requis"],
    unique: true,
    description: "adresse e-mail de l'utilisateur [unique]",
  },
  password: {
    type: String,
    required: true,
    description: "mot de passe haché de l'utilisateur",
  },
});

userSchema.plugin(uniqueValidator); // On applique le plugin de mongoose-unique-validator au schéma. Il va donc vérfier si il n'y a pas de doublons dans notre collection.

module.exports = mongoose.model('Users', userSchema); // On exporte le modèle basé sur le schéma userSchema que nous avons définit. Le modèle s'appelera "User", ce qui correspont à la collection MongoDB associée.
