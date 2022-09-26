const express = require("express");
const {
    getAllBookmarks,
    createBookmark,
    getSingleBookmark,
    updateBookmark,
    deleteBookmark,
    toggleFavorite,
    toggleTrash,
    getAllFavoriteBookmarks,
    getAllTrashBookmarks,
} = require("../controllers/bookmarks.controllers");
const router = express.Router();

router.route("/").get(getAllBookmarks).post(createBookmark);

router.route("/favorite").get(getAllFavoriteBookmarks);
router.route("/toggle-favorite/:id").get(toggleFavorite);

router.route("/trash").get(getAllTrashBookmarks);
router.route("/toggle-trash/:id").get(toggleTrash);

router
    .route("/:id")
    .get(getSingleBookmark)
    .put(updateBookmark)
    .delete(deleteBookmark);

module.exports = router;
