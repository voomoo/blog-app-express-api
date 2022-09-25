const Blogs = require("../models/Blogs.model");

//@DESC Get all Blogs
//@Route GET /api/v1/blogs
//@Access Public
exports.getAllBlogs = async (req, res, next) => {
    try {
        const blogs = await Blogs.find();
        res.status(200).json({
            success: true,
            count: blogs.length,
            message: "All blogs fetched successfully",
            data: blogs,
        });
    } catch (error) {
        res.status(400).json({ success: false });
    }
};

//@DESC Get single Blog
//@Route GET /api/v1/blogs/:id
//@Access Public
exports.getSingleBlog = async (req, res, next) => {
    try {
        const blog = await Blogs.findById(req.params.id);

        if (!blog) {
            return res
                .status(400)
                .json({ success: false, message: "Blog not found" });
        }
        res.status(200).json({
            success: true,
            message: "Blog fetched successfully",
            data: blog,
        });
    } catch (error) {
        res.status(400).json({ success: false });
    }
};

//@DESC Create Blog
//@Route POST /api/v1/blogs/
//@Access Private
exports.createBlog = async (req, res, next) => {
    try {
        const blog = await Blogs.create(req.body);
        res.status(201).json({
            success: true,
            message: `Blog added successfully`,
            data: blog,
        });
    } catch (error) {
        res.status(400).json({ success: false });
    }
};

//@DESC Update Blogs
//@Route PUT /api/v1/blogs/:id
//@Access Private
exports.updateBlog = async (req, res, next) => {
    try {
        const blog = await Blogs.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });

        if (!blog) {
            return res.status(400).json({ success: false });
        }

        res.status(200).json({
            success: true,
            message: `Blog updated successfully`,
            data: blog,
        });
    } catch (error) {
        res.status(400).json({ success: false });
    }
};

//@DESC Delete Blog
//@Route DELETE /api/v1/blogs/:id
//@Access Private
exports.deleteBlog = async (req, res, next) => {
    try {
        const blog = await Blogs.findByIdAndDelete(req.params.id);

        if (!blog) {
            return res.status(400).json({ success: false });
        }

        res.status(200).json({
            success: true,
            message: `Blog deleted successfully`,
            data: blog,
        });
    } catch (error) {
        res.status(400).json({ success: false });
    }
};
