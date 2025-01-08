const express = require("express");
const auth = require("../middleware/auth")
const multer = require("../middleware/multer-config")
const {
  setBooks,
  getBooks,
  updateBooks,
  removeBooks,
} = require("../controllers/book.controllers");
const router = express.Router();


router.get("/books", getBooks);

router.post("/books", auth, multer, setBooks);

router.put("/books/:id",auth, multer, updateBooks);

router.delete("/book/:id",auth, removeBooks);
module.exports = router;
