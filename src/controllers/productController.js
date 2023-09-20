const fs = require("fs");
const slugify = require("slugify");
const Product = require("../models/productModel");

exports.create = async (req, res) => {
	try {
		const { name, description, price, category, quantity, shipping } =
			req.fields;
		const { photo } = req.files;

		switch (true) {
			case !name.trim():
				return res.json({ error: "Name is required" });
			case !description.trim():
				return res.json({ error: "Description is required" });
			case !price:
				return res.json({ error: "Price is required" });
			case !category.trim():
				return res.json({ error: "Category is required" });
			case !quantity:
				return res.json({ error: "Quantity is required" });
			case !shipping.trim():
				return res.json({ error: "Shipping is required" });
			case photo && photo.size > 5000000:
				return res.json({
					error: "Image should be less than 5mb in size",
				});
		}
		const newProduct = new Product({
			...req.fields,
			slug: slugify(name),
		});
		if (photo) {
			newProduct.photo.data = fs.readFileSync(photo.path); //fs.readFileSync() gives buffer value
			newProduct.photo.contentType = photo.type; //string
		}

		await newProduct.save();
		res.json(newProduct);
	} catch (error) {
		return res.json(error.message);
	}
};

exports.list = async (req, res) => {
	try {
		const allProducts = await Product.find({})
			.populate("category")
			.select("-photo")
			.limit(12)
			.sort({ createdAt: -1 });
		res.json(allProducts);
	} catch (error) {
		res.json(error.message);
	}
};

exports.read = async (req, res) => {
	try {
		const product = await Product.findOne({ slug: req.params.slug })
			.populate("category")
			.select("-photo");
		res.json(product);
	} catch (error) {
		res.json(error.message);
	}
};

exports.photo = async (req, res) => {
	try {
		const product = await Product.findById(req.params.productId).select(
			"photo"
		);
		if (product.photo.data) {
			res.set("Content-Type", product.photo.contentType);
			res.set("Cross-Origin-Resource-Policy", "cross-origin");
			return res.send(product.photo.data);
		}
	} catch (error) {
		res.json({ error: error.message });
	}
};

exports.remove = async (req, res) => {
	try {
		const removeProduct = await Product.findByIdAndRemove(
			req.params.productId
		).select("-photo");
		res.json({ RemoveProduct: removeProduct });
	} catch (error) {
		res.json(error.message);
	}
};

exports.update = async (req, res) => {
	try {
		const { name, description, price, category, quantity, shipping } =
			req.fields;
		const { photo } = req.files;

		switch (true) {
			case !name.trim():
				return res.json({ error: "Name is required!" });
			case !description?.trim():
				return res.json({ error: "Description is required" });
			case !price?.trim():
				return res.json({ error: "Price is required" });
			case !category?.trim():
				return res.json({ error: "Category is required" });
			case !quantity?.trim():
				return res.json({ error: "Quantity is required" });
			case !shipping?.trim():
				return res.json({ error: "Shipping is required" });
			case photo && photo.size > 1000000:
				return res.json({
					error: "Image should be less than 1mb in size",
				});
		}
		const product = await Product.findByIdAndUpdate(
			req.params.productId,
			{
				...req.fields,
				slug: slugify(name),
			},
			{ new: true }
		);
		res.json({ updateData: product });
	} catch (error) {
		res.json(error.message);
	}
};

exports.filteredProducts = async (req, res) => {
	try {
		//here checked and radio both are arrays
		const { checked, radio } = req.body;

		let args = {};
		if (checked.length > 0 && radio.length > 0) {
			args.category = checked;
			args.price = { $gte: radio[0], $lte: radio[1] };
		}
		/* args = {
			category: checked,
			radio: { $gte: radio[0], $lte: radio[1] }
		} 
		*/
		const products = await Product.find(args);
		res.json(products);
	} catch (error) {
		res.json(error.message);
	}
};

exports.productsCount = async (req, res) => {
	try {
		const total = await Product.find({}).estimatedDocumentCount();
		res.json(total);
	} catch (error) {
		res.json(error.message);
	}
};

exports.listProducts = async (req, res) => {
	try {
		const perPage = 2;
		const page = req.params.page ? req.params.page : 1;

		const products = await Product.find({})
			.select("-photo")
			.skip((page - 1) * perPage)
			.sort({ createdAt: -1 });
		res.json(products);
	} catch (error) {
		res.json(error.message);
	}
};

exports.productSearch = async (req, res) => {
	try {
		const { keyword } = req.params;
		const results = await Product.find({
			$or: [
				{ name: { $regex: keyword, $options: "i" } },
				{ description: { $regex: keyword, $options: "i" } },
			],
		}).select("-photo");
		res.json(results);
	} catch (error) {
		res.json(error.message);
	}
};

exports.relatedProducts = async (req, res) => {
	try {
		const { productId, categoryId } = req.params;
		const products = await Product.find({
			category: categoryId,
			_id: { $ne: productId },
		})
			.populate("category")
			.select("-photo")
			.limit(3);
		res.json(products);
	} catch (error) {
		res.json(error.message);
	}
};
