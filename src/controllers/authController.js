const User = require("../models/userModel");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const { hashPassword, comparePassword } = require("../helpers/hashPass");
const Order = require("../models/orderModel");

exports.register = async (req, res) => {
	try {
		// 1. destructure name, email, password from req.body
		const { name, email, password, address, role } = req.body;
		// 2. name, email, password fields require validation
		if (!name) {
			return res.json({ error: "Name is required!" });
		}
		if (!email) {
			return res.json({ error: "Email is required!" });
		}
		if (!password || password.length < 6) {
			return res.json({
				error: "Password must be at least 6 characters long",
			});
		}

		// 3. check if email is taken
		const existingEmail = await User.findOne({ email });
		if (existingEmail) {
			return res.json({ error: "Email is already taken!" });
		}
		// 4. hash password
		const hashedPassword = await hashPassword(password);

		//5. register new user
		const newUser = await new User({
			name,
			email,
			password: hashedPassword,
			address,
		}).save();

		const token = jwt.sign({ _id: newUser._id }, process.env.SECRET_KEY, {
			expiresIn: "1h",
		});

		res.json({
			user: {
				name: newUser.name,
				email: newUser.email,
				role: newUser.role,
				address: newUser.address,
			},
			token,
		});
	} catch (error) {
		res.json(error.message);
	}
};

exports.login = async (req, res) => {
	try {
		//1. destructuring fron req.body
		const { email, password } = req.body;
		//2. validate
		if (!email) {
			res.json({ error: "Email is required" });
		}
		if (!password || password.length < 6) {
			res.json({ error: "Password must be at least 6 characters long" });
		}
		const user = await User.findOne({ email });
		if (!user) {
			res.json({ error: "User not found!" });
		}

		const matchPassword = await comparePassword(password, user.password);
		if (!matchPassword) {
			res.json({ error: "Invalid password" });
		}
		const token = jwt.sign({ _id: user._id }, process.env.SECRET_KEY, {
			expiresIn: "1h",
		});
		res.json({
			user: {
				name: user.name,
				email: user.email,
				role: user.role,
				address: user.address,
			},
			token,
		});
	} catch (error) {
		res.json(error.message);
	}
};

exports.updateProfile = async (req, res) => {
	try {
		const { name, password, address } = req.body;
		const user = User.findById(req.user._id);

		if (password && password.length < 6) {
			return res.json({
				error: "Password must be at least 6 characters long",
			});
		}
		const hashedPassword = password
			? await hashPassword(password)
			: undefined;

		const updated = await User.findByIdAndUpdate(
			req.user._id,
			{
				name: name || user.name,
				password: hashedPassword || user.password,
				address: address || user.address,
			},
			{ new: true }
		);
		updated.password = undefined; // so that in the response password will not be shown.
		res.json(updated); //updated is a obj, so do not use {}
	} catch (error) {
		res.json(error.message);
	}
};

exports.showOrders = async (req, res) => {
	try {
		const orders = await Order.find({ buyer: req.user._id })
			.populate("products", "-photo")
			.populate("buyer", "name");
		res.json(orders);
	} catch (error) {
		res.json(error.message);
	}
};

exports.allOrders = async (req, res) => {
	try {
		const orders = await Order.find({})
			.populate("products", "-photo")
			.populate("buyer", "name")
			.sort({ createdAt: "-1" });
		res.json(orders);
	} catch (error) {
		res.json(error.message);
	}
};
