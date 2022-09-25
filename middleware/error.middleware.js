const errorHanndler = (err, erq, res, next) => {
    //Log to console for dev
    console.log(
        "Message from errorHandler middleware: ".blue.inverse,
        err.stack.red
    );
    res.status(err.statusCode || 500).json({
        success: false,
        error: err.message || "Server error",
    });
};

module.exports = errorHanndler;
