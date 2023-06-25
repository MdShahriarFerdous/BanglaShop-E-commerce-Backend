const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			trim: true,
			required: true,
		},
		email: {
			type: String,
			trim: true,
			required: true,
			unique: true,
		},
		password: {
			type: String,
			required: true,
			min: 6,
			max: 64,
		},
		address: {
			type: String,
			trim: true,
		},
		role: {
			type: Number,
			default: 0, // 1 means admin
		},
	},
	{
		timestamps: true,
		versionKey: false,
	}
);

const User = mongoose.model("User", userSchema);
module.exports = User;
