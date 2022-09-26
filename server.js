const express = require("express");
const dotenv = require("dotenv");
const bookmarkRoutes = require("./routes/bookmarks.routes");
const morgan = require("morgan");
const connectDB = require("./config/db.config");
const colors = require("colors");
const errorHandler = require("./middleware/error.middleware");
const fileUpload = require("express-fileupload");
const path = require("path");

//Load env vars
dotenv.config({
    path: "./config/config.env",
});

connectDB();

const app = express();

//Body Parser
app.use(express.json());

//File uploading
app.use(fileUpload());

//Set static folder
app.use(express.static(path.join(__dirname, "public")));

if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
}

app.use("/api/v1/bookmarks", bookmarkRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(
    PORT,
    console.log(
        `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow
            .bold
    )
);

//Handle unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
    console.log(`Error: ${err.message}`.red.underline);

    //close server and exit process
    ServiceWorkerRegistration.close(() => process.exit(1));
});
