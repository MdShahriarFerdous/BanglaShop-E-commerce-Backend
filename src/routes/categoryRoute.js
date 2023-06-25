const express = require("express");
const router = express.Router();

const { requireSignIn, isAdmin } = require("../middlewares/authMiddleware");
const {
	create,
	update,
	remove,
	list,
	read,
} = require("../controllers/categoryController");

router.post("/category", requireSignIn, isAdmin, create);
router.put("/category/:categoryId", requireSignIn, isAdmin, update);
router.delete("/category/:categoryId", requireSignIn, isAdmin, remove);
router.get("/categories", list);
router.get("/category/:slug", read);

module.exports = router;
