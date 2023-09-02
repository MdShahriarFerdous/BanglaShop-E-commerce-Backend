//core node module import
const { readdirSync } = require("fs");

//Config Lib import and configured
require("dotenv").config();

//Basic Lib import
const express = require("express");
const app = express();

//DevDependency Lib import
const morgan = require("morgan");

//Security Middleware Lib import
const helmet = require("helmet");
const cors = require("cors");
const hpp = require("hpp"); // to protect against HTTP Parameter Pollution attacks
const rateLimit = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize"); //which sanitizes user-supplied data to prevent MongoDB Operator Injection.

// Database Lib import
const mongoose = require("mongoose");

// Middlewares implement
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(cors());
app.use(mongoSanitize());
app.use(hpp());
app.use(morgan("dev"));

// Request Rate Limit
const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 100, // limit each IP to 100 requests per windowMs
});
app.use(limiter);

//mongoose set up and connection
mongoose.set("strictQuery", false);
mongoose
	.connect(process.env.MONGO_DB_CONNECTION)
	.then(() => {
		console.log("MongoDB connected!!");
	})
	.catch((err) => {
		console.log("Failed to connect to MongoDB", err.message);
	});

//for multiplefiles in routes folder
readdirSync("./src/routes").map((router) => {
	app.use("/api/v1", require(`./src/routes/${router}`));
});

// undefined route
app.use("*", (req, res) => {
	res.json({ Failed: "Your request is failed!" });
});

app.listen(process.env.PORT || 8000, () => {
	console.log("Server is running on port: 8000");
});
