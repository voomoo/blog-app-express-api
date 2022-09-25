const express = require("express");
const {
    getAllBlogs,
    getSingleBlog,
    updateBlog,
    deleteBlog,
    createBlog,
} = require("../controllers/blogs.controllers");
const router = express.Router();

router.route("/").get(getAllBlogs).post(createBlog);

router.route("/:id").get(getSingleBlog).put(updateBlog).delete(deleteBlog);

module.exports = router;
