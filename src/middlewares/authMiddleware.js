const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
require("dotenv").config();

exports.requireSignIn = async (req, res, next) => {
	try {
		/* from frontend it will be like 
		{
			headers:{
				authorization: localStorage.getItem("auth/authorization/token")
			}
			}
*/
		const token = req.headers.authorization;
		if (!token) {
			return res
				.status(401)
				.json({ error: "Unauthorized: No token provided" });
		}
		const decoded = jwt.verify(token, process.env.SECRET_KEY);
		req.user = decoded;

		// console.log(req.headers.auth);
		// console.log(req.user);

		next();
	} catch (error) {
		return res
			.status(401)
			.json({ status: error.message, failed: "Unauthorized" });
	}
};

exports.isAdmin = async (req, res, next) => {
	try {
		const user = await User.findById(req.user._id);

		if (user.role !== 1) {
			return res.status(401).send("Unauthorized");
		} else {
			next();
		}
	} catch (error) {
		res.json(error.message);
	}
};
