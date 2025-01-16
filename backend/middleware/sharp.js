const sharp = require('sharp');
const fs = require('fs');

//Image optimization
async function sharpImage(req, res, next) {
  fs.access('./images', (error) => {
    if (error) {
      fs.mkdirSync('./images'); //creates 'images' directory if not existant
    }
  });
  if (!req.file?.buffer) {
    return next('un fichier est manquant');
  }
  const buffer = req.file.buffer; // buffer = image stock to memory
  const newName = `${Date.now()}.webp`;

  req.file.filename = newName;

  await sharp(buffer)
    // .resize(1000)
    .webp({ quality: 60 })
    .toFile('./images/' + newName);
  return next();
}

module.exports = sharpImage; //Image upload for routes
