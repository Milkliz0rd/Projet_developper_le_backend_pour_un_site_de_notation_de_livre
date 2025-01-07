const app = require("../app/app.js");
const connectDB = require("../config/db.js");
const dotenv = require("dotenv");
dotenv.config();
const port = 4000;
connectDB();
app.listen(port, () => {
  console.log(`le serveur a démarré sur http://localhost:${port}`);
});
