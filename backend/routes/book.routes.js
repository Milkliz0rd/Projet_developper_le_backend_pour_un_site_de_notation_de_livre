const express = require("express");
const auth = require("../middleware/auth")
const multer = require("../middleware/multer-config")
const {
  setBooks,
  getBooks,
  updateBooks,
  removeBooks,
  getBook,
} = require("../controllers/book.controllers");
const router = express.Router();


router.get("/", getBooks);
router.get("/",getBook)
router.post("/", auth, multer, setBooks);
router.put("/:id",auth, multer, updateBooks);
router.delete("/:id",auth, removeBooks);
module.exports = router;
