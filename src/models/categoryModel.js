const mongoose = require("mongoose");

const categoryschema = new mongoose.Schema(
	{
		name: {
			type: String,
			unique: true,
			required: true,
			trim: true,
			maxLength: 32,
		},
		slug: {
			type: String,
			lowercase: true,
			unique: true,
		},
	},
	{
		timestamps: true,
		versionKey: false,
	}
);

const Category = mongoose.model("Category", categoryschema);
module.exports = Category;
