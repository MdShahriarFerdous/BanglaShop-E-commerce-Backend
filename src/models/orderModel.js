const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const orderSchema = new mongoose.Schema(
	{
		products: [
			{
				type: ObjectId,
				ref: "Product",
			},
		],
		payment: {},
		buyer: {
			type: ObjectId,
			ref: "User",
		},
		status: {
			type: String,
			default: "Not processed",
			enum: [
				"Not processed",
				"Processing",
				"Shipped",
				"Delivered",
				"Cancelled",
			],
		},
	},
	{
		timestamps: true,
		versionKey: false,
	}
);

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;
