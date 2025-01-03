const mongoose = require("mongoose");
const crypto = require("crypto");

const mykey = crypto.createCipher("aes-128-cbc", "mypassword");

const userSchema = mongoose.Schema({
  email: {
    type: String,
    validate: {
      validator: (v) =>
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(v),
      message: (s) => `${s.value} is not a valid email`,
    },
    required: true,
    unique: true,
    description: "adresse e-mail de l'utilisateur [unique]",
  },
  password: {
    type: String,
    required: true,
    description: "mot de passe haché de l'utilisateur",
  },
});

userSchema.pre("save", function () {
  console.log("presave", this);
  const mystr = mykey.update("abc", "utf8", "hex");
  mystr += mykey.final("hex");

  console.log(mystr);
  this.password = mystr;
});

module.exports = mongoose.model("Users", userSchema);
