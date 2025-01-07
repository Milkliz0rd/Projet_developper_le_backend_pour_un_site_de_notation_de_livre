const express = require("express");
const auth = require("../middleware/auth")
const {
  setBooks,
  getBooks,
  updateBooks,
  removeBooks,
} = require("../controllers/book.controllers");
const router = express.Router();


router.get("/books", auth, getBooks);

router.post("/books",auth, setBooks);

router.put("/books/:id",auth, updateBooks);

router.delete("/book/:id",auth, removeBooks);
module.exports = router;
