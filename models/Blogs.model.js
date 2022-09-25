const mongoose = require("mongoose");

const BlogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Must provide a title for the blog"],
        trim: true,
        maxlength: [200, "Title cannot exceed 200 characters"],
    },
    subTitle: {
        type: String,
        trim: true,
    },
    blogBody: {
        type: String,
        required: [true, "Must provide a body for the blog"],
        minlength: [100, "Must have at least 100 characters"],
    },
    tags: {
        type: [String],
        required: [true, "Must provide tags"],
    },
    totalLikes: {
        type: Number,
        default: 0,
    },
    totalComments: {
        type: Number,
        default: 0,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("Blogs", BlogSchema);
