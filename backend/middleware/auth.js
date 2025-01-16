const jwt = require('jsonwebtoken'); // On importe le module jsonwebtoken pour gérer les méchanisme d'authentification

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    //on transforme req.headers.authorization en tableau grâce à split et à chaque espace il créé un élement
    // [1] veut dire que l'on veut le second élément du tableau (le token)
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET); //cette ligne vérifie la validité du token avec verify de jwt. On le vérfie par rapport à la clé secrète "JWT_SECRET". qui doit correspondre (...)
    const userId = decodedToken.userId;
    req.auth = {
      userId: userId,
    };
    next();
  } catch (error) {
    res.status(401).json({ error });
  }
};
