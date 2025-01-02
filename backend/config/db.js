const mongoose = require("mongoose");

const connectDB = async () => {
  mongoose.set("strictQuery", false);
  await mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("Connexion à MongoDB réussi"))
    .catch(() => console.log("Connexion à MongoDB échoué"));
};

module.exports = connectDB;
