const app = require("../app/app.js");
const port = 5000;
app.listen(port, () => {
  console.log(`le serveur a démarré sur http://localhost:${port}`);
});
