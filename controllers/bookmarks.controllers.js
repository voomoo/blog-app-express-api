const asyncHandler = require("../middleware/async.middleware");
const Bookmarks = require("../models/Bookmarks.model");
const ErrorResponse = require("../utils/errorResponse.utils");
const path = require("path");

//@DESC Get all Bookmarks
//@Route GET /api/v1/bookmarks
//@Access Private
exports.getAllBookmarks = asyncHandler(async (req, res, next) => {
    let query = Bookmarks.find();

    //pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 25;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await Bookmarks.countDocuments();

    //get data by category if prodivded in query string
    if (req.query.category) {
        query = Bookmarks.find({ category: req.query.category });
    }

    //if provided in query string return only selected fields
    if (req.query.select) {
        const fields = req.query.select.split(",").join(" ");
        query = query.select(fields);
    }

    //search from data if provided in query string
    if (req.query.search) {
        query = query.find({
            $or: [
                { name: { $regex: req.query.search, $options: "i" } },
                { website: { $regex: req.query.search, $options: "i" } },
            ],
        });
    }

    query = query.skip(startIndex).limit(limit);

    const bookmarks = await query;

    const pagination = {};

    if (endIndex < total) {
        pagination.next = {
            page: page + 1,
            limit,
        };
    }

    if (startIndex > 0) {
        pagination.prev = {
            page: page - 1,
            limit,
        };
    }

    pagination.total = total;

    res.status(200).json({
        success: true,
        count: bookmarks.length,
        message: "All bookmarks fetched successfully",
        data: bookmarks,
        pagination,
    });
});

//@DESC Get single Bookmark
//@Route GET /api/v1/bookmarks/:id
//@Access Private
exports.getSingleBookmark = asyncHandler(async (req, res, next) => {
    const bookmark = await Bookmarks.findById(req.params.id);

    if (!bookmark) {
        return res
            .status(400)
            .json({ success: false, message: "Bookmark not found" });
    }
    res.status(200).json({
        success: true,
        message: "Bookmark fetched successfully",
        data: bookmark,
    });
});

//@DESC Create Bookmark
//@Route POST /api/v1/bookmarks/
//@Access Private
exports.createBookmark = asyncHandler(async (req, res, next) => {
    if (req.files) {
        const file = req.files.file;

        //Make sure file is a photo
        if (!file.mimetype.startsWith("image")) {
            return next(new ErrorResponse("Invalid image", 400));
        }

        //Check file size
        if (file.size > process.env.MAX_FILE_UPLOAD) {
            return next(
                new ErrorResponse(
                    `Please upload a file less than ${process.env.MAX_FILE_UPLOAD} bytes`,
                    400
                )
            );
        }

        //Create custom filename
        file.name = `photo_${req.body.name.split(" ").join("_")}_${Date.now()}${
            path.parse(file.name).ext
        }`;
        req.body.image = file.name;
        //Move file to public folder
        file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (err) => {
            if (err) {
                console.error(err);
                return next(new ErrorResponse("Problem with file upload", 400));
            }
        });
    }
    const bookmark = await Bookmarks.create(req.body);
    res.status(201).json({
        success: true,
        message: `Bookmark added successfully`,
        data: bookmark,
    });
});

//@DESC Update Bookrmark
//@Route PUT /api/v1/bookmark/:id
//@Access Private
exports.updateBookmark = asyncHandler(async (req, res, next) => {
    const bookmark = await Bookmarks.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
            new: true,
            runValidators: true,
        }
    );

    if (!bookmark) {
        return res.status(400).json({ success: false });
    }

    res.status(200).json({
        success: true,
        message: `Bookmark updated successfully`,
        data: bookmark,
    });
});

//@DESC Delete Bookmark
//@Route DELETE /api/v1/bookmark/:id
//@Access Private
exports.deleteBookmark = asyncHandler(async (req, res, next) => {
    const bookmark = await Bookmarks.findByIdAndDelete(req.params.id);

    if (!bookmark) {
        return res.status(400).json({
            success: false,
            message: `No bookmark found with the id of ${req.params.id}`,
        });
    }

    res.status(200).json({
        success: true,
        message: `Bookmark deleted successfully`,
        data: bookmark,
    });
});

//@DESC Get all Favorite Bookmarks
//@Route GET /api/v1/bookmarks/favorite
//@Access Private
exports.getAllFavoriteBookmarks = asyncHandler(async (req, res, next) => {
    let query = Bookmarks.find({ isFavorite: true });

    //pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 25;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await Bookmarks.countDocuments();

    //if provided in query string return only selected fields
    if (req.query.select) {
        const fields = req.query.select.split(",").join(" ");
        query = query.select(fields);
    }

    //search from data if provided in query string
    if (req.query.search) {
        query = query.find({
            $or: [
                { name: { $regex: req.query.search, $options: "i" } },
                { website: { $regex: req.query.search, $options: "i" } },
            ],
        });
    }

    query = query.skip(startIndex).limit(limit);

    const bookmarks = await query;

    const pagination = {};

    if (endIndex < total) {
        pagination.next = {
            page: page + 1,
            limit,
        };
    }

    if (startIndex > 0) {
        pagination.prev = {
            page: page - 1,
            limit,
        };
    }

    pagination.total = total;

    res.status(200).json({
        success: true,
        count: bookmarks.length,
        message: "All favorite bookmarks fetched successfully",
        data: bookmarks,
        pagination,
    });
});

//@DESC Toggle Favorite
//@Route GET /api/v1/bookmark/toggle-favorite/:id
//@Access Private
exports.toggleFavorite = asyncHandler(async (req, res, next) => {
    const bookmark = await Bookmarks.findById(req.params.id);

    if (!bookmark) {
        return next(
            new ErrorResponse(`No bookmark found with id ${req.params.id}`)
        );
    }

    const updateBookmark = await Bookmarks.findByIdAndUpdate(
        req.params.id,
        { isFavorite: !bookmark.isFavorite },
        { new: true, runValidators: true }
    );

    res.status(200).json({
        success: true,
        message: !bookmark.isFavorite
            ? "Bookmark added to favorite"
            : "Bookmark removed from favorite",
        data: updateBookmark,
    });
});

//@DESC Get all Trash Bookmarks
//@Route GET /api/v1/bookmarks/trash
//@Access Private
exports.getAllTrashBookmarks = asyncHandler(async (req, res, next) => {
    let query = Bookmarks.find({ isTrash: true });

    //pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 25;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await Bookmarks.countDocuments();

    //if provided in query string return only selected fields
    if (req.query.select) {
        const fields = req.query.select.split(",").join(" ");
        query = query.select(fields);
    }

    //search from data if provided in query string
    if (req.query.search) {
        query = query.find({
            $or: [
                { name: { $regex: req.query.search, $options: "i" } },
                { website: { $regex: req.query.search, $options: "i" } },
            ],
        });
    }

    query = query.skip(startIndex).limit(limit);

    const bookmarks = await query;

    const pagination = {};

    if (endIndex < total) {
        pagination.next = {
            page: page + 1,
            limit,
        };
    }

    if (startIndex > 0) {
        pagination.prev = {
            page: page - 1,
            limit,
        };
    }

    pagination.total = total;

    res.status(200).json({
        success: true,
        count: bookmarks.length,
        message: "All trashed bookmarks fetched successfully",
        data: bookmarks,
        pagination,
    });
});

//@DESC Toggle Trash
//@Route GET /api/v1/bookmark/toggle-trash/:id
//@Access Private
exports.toggleTrash = asyncHandler(async (req, res, next) => {
    const bookmark = await Bookmarks.findById(req.params.id);

    if (!bookmark) {
        return next(
            new ErrorResponse(`No bookmark found with id ${req.params.id}`)
        );
    }

    const updateBookmark = await Bookmarks.findByIdAndUpdate(
        req.params.id,
        { isTrash: !bookmark.isTrash },
        { new: true, runValidators: true }
    );

    res.status(200).json({
        success: true,
        message: !bookmark.isTrash
            ? "Bookmark moved to trash"
            : "Bookmark restored from trash",
        data: updateBookmark,
    });
});
