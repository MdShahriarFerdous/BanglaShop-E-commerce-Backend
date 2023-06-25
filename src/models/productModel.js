const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const productSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			maxLength: 160,
			trim: true,
		},
		slug: {
			type: String,
			lowercase: true,
		},
		description: {
			type: {}, //blank obj
			required: true,
			maxLength: 2000,
		},
		price: {
			type: Number,
			required: true,
			trim: true,
		},
		category: {
			type: ObjectId,
			ref: "Category", //Category model
			required: true,
		},
		quantity: {
			type: Number,
		},
		sold: {
			type: Number,
			default: 0,
		},
		photo: {
			data: Buffer,
			contentType: String,
		},
		shipping: {
			type: Boolean,
			required: false,
		},
	},
	{ timestamps: true, versionKey: false }
);
const Product = mongoose.model("Product", productSchema);
module.exports = Product;

// maxLength is the recommended way to specify this option, but Mongoose also supports maxlength (lowercase "l").
