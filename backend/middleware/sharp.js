const sharp = require('sharp'); // Importation du module 'sharp' qui permet de manipuler des images (redimensionner, convertir, etc.)
const fs = require('fs'); // Importation du module 'fs' qui permet d'interagir avec le système de fichiers (lecture, écriture, création de fichiers ou répertoires)

async function sharpImage(req, res, next) {
  // fonction qui va nous permettre de convertire nous fichier image que l'on va recevoir sur nos formulaire en webp
  fs.access('./images', (error) => {
    if (error) {
      fs.mkdirSync('./images'); //creates 'images' directory if not existant
    }
  }); // On utilise fs.acces pour vérfier si le dossier ./images existe. Si il n'existe, renvoie un erreur et si erreur, il crée le dossier image.
  if (!req.file?.buffer) {
    return next('un fichier est manquant');
  } // Ici notre condition nous dis que si on a aucun fichier dans notre requête on return une erreur avec next()
  const buffer = req.file.buffer; // Récupération de l'image envoyée sous forme de buffer (image stockée en mémoire)
  const newName = `${Date.now()}.webp`; // Gnération d'un nom unique pour l'image en utilisant l'heure actuelle(en millisecondes), suivi de l'extension '.webp. Cela garantit que chaque image aura un nom unique.

  req.file.filename = newName; // L'attribut 'filename' de 'req.file' est mis à jour avec le nouveau nom de fichier.

  await sharp(buffer) //Le 'buffer' contenant l'image est passé à la fonction sharp. Cela permet de manipuler l'image en mémoire.
    .webp({ quality: 60 }) // la methode .webp convertit l'image en format webp avec une qualité de 60%
    .toFile('./images/' + newName); // L'image optimisé est ensuite enregistré dans le dossier './images' sous le nom de ficher généré
  return next(); // On passe au middleware suivant avec next()
}

module.exports = sharpImage; // On exporte la fonction 'sharpImage' afin d'être utilisé dans d'autres fichiers.
