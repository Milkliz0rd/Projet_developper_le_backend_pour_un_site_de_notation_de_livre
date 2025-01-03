const express = require("express");
const {
  setBooks,
  getBooks,
  updateBooks,
  removeBooks,
} = require("../controllers/book.controllers");
const router = express.Router();

router.get("/books", getBooks);

router.post("/books", setBooks);

router.put("/books/:id", updateBooks);

router.delete("/book/:id", removeBooks);
module.exports = router;
