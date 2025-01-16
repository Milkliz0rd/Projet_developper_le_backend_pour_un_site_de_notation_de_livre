const jwt = require('jsonwebtoken'); // On importe le module jsonwebtoken pour gérer les méchanisme d'authentification

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    //on transforme req.headers.authorization en tableau grâce à split et à chaque espace il créé un élement
    // [1] veut dire que l'on veut le second élément du tableau (le token)
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET); //cette ligne vérifie la validité du token avec verify de jwt. On le vérfie par rapport à la clé secrète "JWT_SECRET" que l'on a sur notre fichier .env. Celle ci,  doit correspondre  à celle utilisé lors de la création du Token. Si le token est validé, la fonction renvoie l'objet décodé du token(ex _userId )
    const userId = decodedToken.userId; // Une fois le token décodé, cette ligne extrait l'ID de de l'utilisateur (présumé être dans le champ userID du token) et le stock dans la variable userId
    req.auth = {
      userId: userId,
    }; //cette ligne ajoute un objet auth à l'objet req qui contient l'userID. Cet objet pourra être utilisé dans les middlewares suivants pour vérfier l'authentification et l'autorisation de l'utilisateur
    next(); // passe aux middlewares suivants
  } catch (error) {
    res.status(401).json({ error });
  } // en cas d'erreur, envoie une réponse http avec le code status 401 (unauthorized)
};
