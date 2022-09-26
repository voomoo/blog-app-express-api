const express = require("express");
const {
    getAllBookmarks,
    createBookmark,
    getSingleBookmark,
    updateBookmark,
    deleteBookmark,
} = require("../controllers/bookmarks.controllers");
const router = express.Router();

router.route("/").get(getAllBookmarks).post(createBookmark);

router
    .route("/:id")
    .get(getSingleBookmark)
    .put(updateBookmark)
    .delete(deleteBookmark);

module.exports = router;
