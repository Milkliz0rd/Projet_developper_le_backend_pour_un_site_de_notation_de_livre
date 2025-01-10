const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const userSchema = mongoose.Schema({
  email: {
    type: String,
    validate: {
      validator: (v) =>
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(v),
      message: (s) => `${s.value} is not a valid email`,
    },
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

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("Users", userSchema);
