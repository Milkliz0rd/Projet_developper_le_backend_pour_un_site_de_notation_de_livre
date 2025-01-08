const express = require("express");
const auth = require("../middleware/auth")
const multer = require("../middleware/multer-config")
const {
  setBooks,
  getBooks,
  updateBooks,
  removeBooks,
  getBook,
  addRating,
} = require("../controllers/book.controllers");
const router = express.Router();


router.get("/", getBooks);
router.get("/:id",getBook)
router.post("/", auth, multer, setBooks);
router.post("/:id/rating", auth, addRating)
router.put("/:id",auth, multer, updateBooks);
router.delete("/:id",auth, removeBooks);
module.exports = router;
