const express = require("express");
const dotenv = require("dotenv");
const blogRoutes = require("./routes/blogs.routes");
const morgan = require("morgan");
const connectDB = require("./config/db.config");
const colors = require("colors");

//Load env vars
dotenv.config({
    path: "./config/config.env",
});

connectDB();

const app = express();

//Body Parser
app.use(express.json());

if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
}

app.use("/api/v1/blogs", blogRoutes);

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
