const mongoose = require("mongoose");

const BookmarkSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Must provide a name for the bookmark"],
        trim: true,
        maxlength: [100, "Name cannot exceed 100 characters"],
    },
    note: {
        type: String,
        maxlength: [500, "Note cannot exceed 500 characters"],
    },
    website: {
        type: String,
        match: [
            /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi,
            "Please add a valid website",
        ],
        required: [true, "Must provide a website"],
    },
    category: {
        type: String,
        required: [true, "Must provide a category"],
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

module.exports = mongoose.model("Bookmarks", BookmarkSchema);
