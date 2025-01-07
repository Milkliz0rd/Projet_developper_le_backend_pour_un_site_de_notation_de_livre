const jwt = require("jsonwebtoken")

module.exports = (req, res, next) => {
try {
const token = req.headers.authorization.split(' ')[1]; //on transforme req.headers.authorization en tableau grâce à split et à chaque espace il créé un élement
const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
const userId = decodedToken.userId
req.auth = {
  userId: userId
}
next();
}catch(error){
  res.status(401).json({error})
}
}