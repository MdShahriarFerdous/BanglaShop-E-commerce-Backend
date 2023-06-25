const Category = require("../models/categoryModel");
const slugify = require("slugify");

exports.create = async (req, res) => {
	try {
		//we will use this name to create the slug
		//so we are taking only name
		const { name } = req.body;

		if (!name.trim()) {
			return res.json({ error: "Name is Required!" });
		}
		const existCategory = await Category.findOne({ name });
		if (existCategory) {
			return res.json({ error: "Category already exist" });
		}

		const newCategory = await new Category({
			name,
			slug: slugify(name),
		}).save();
		res.json(newCategory);
	} catch (error) {
		res.json(error.message);
	}
};

exports.update = async (req, res) => {
	try {
		const { name } = req.body;
		const { categoryId } = req.params;

		const updated = await Category.findByIdAndUpdate(
			categoryId,
			{
				name,
				slug: slugify(name),
			},
			{ new: true }
		);
		res.json({ updateData: updated });
	} catch (error) {
		res.json(error.message);
	}
};

exports.remove = async (req, res) => {
	try {
		const { categoryId } = req.params;
		const removed = await Category.findByIdAndRemove(categoryId);
		res.json({ removedData: removed });
	} catch (error) {
		res.json(error.message);
	}
};

exports.list = async (req, res) => {
	try {
		const allList = await Category.find({});
		res.json(allList);
	} catch (error) {
		res.json(error.message);
	}
};
exports.read = async (req, res) => {
	try {
		const categorySlug = req.params.slug;
		const particularCategory = await Category.findOne({
			slug: categorySlug,
		});
		res.json(particularCategory);
	} catch (error) {
		res.json(error.message);
	}
};
