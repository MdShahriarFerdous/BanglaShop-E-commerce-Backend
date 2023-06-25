const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
require("dotenv").config();

exports.requireSignIn = async (req, res, next) => {
	try {
		const token = req.headers.authorization;
		const decode = jwt.verify(token, process.env.SECRET_KEY);
		req.headers.auth = decode;
		console.log(req.headers.auth);
		next();
	} catch (error) {
		return res
			.status(401)
			.json({ status: error.message, failed: "Unauthorized" });
	}
};

exports.isAdmin = async (req, res, next) => {
	try {
		const decodedUser = req.headers.auth;

		const user = await User.findById(decodedUser._id);

		if (user.role !== 1) {
			return res.status(401).send("Unauthorized");
		} else {
			next();
		}
	} catch (error) {
		res.json(error.message);
	}
};
 