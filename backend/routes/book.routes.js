const express = require("express");
const auth = require("../middleware/auth")
const multer = require("../middleware/multer-config")
const sharp = require("../middleware/sharp")
const {
  setBooks,
  getBooks,
  updateBooks,
  removeBooks,
  getBook,
  addRating,
  bestRatingsBooks,
} = require("../controllers/book.controllers");
const router = express.Router();



router.get("/", getBooks);
router.get("/bestrating", bestRatingsBooks);
router.get("/:id",getBook);
router.post("/", auth, multer, sharp, setBooks);
router.post("/:id/rating", auth, addRating)
router.put("/:id",auth, multer, sharp, updateBooks);
router.delete("/:id",auth, removeBooks);
module.exports = router;
