//@DESC Get all Blogs
//@Route GET /api/v1/blogs
//@Access Public
exports.getAllBlogs = (req, res, next) => {
    res.status(200).json({
        success: true,
        message: "Show all blogs",
    });
};

//@DESC Get single Blog
//@Route GET /api/v1/blogs/:id
//@Access Public
exports.getSingleBlog = (req, res, next) => {
    res.status(200).json({
        success: true,
        message: `Show blog with id ${req.params.id}`,
    });
};

//@DESC Create Blog
//@Route POST /api/v1/blogs/
//@Access Private
exports.createBlog = (req, res, next) => {
    res.status(200).json({
        success: true,
        message: "Create Bootcamp",
    });
};

//@DESC Update Blogs
//@Route PUT /api/v1/blogs/:id
//@Access Private
exports.updateBlog = (req, res, next) => {
    res.status(200).json({
        success: true,
        message: `Update blog with id ${req.params.id}`,
    });
};

//@DESC Delete Blog
//@Route DELETE /api/v1/blogs/:id
//@Access Private
exports.deleteBlog = (req, res, next) => {
    res.status(200).json({
        success: true,
        message: `Delete blog with id ${req.params.id}`,
    });
};
