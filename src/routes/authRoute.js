const express = require("express");
const router = express.Router();

const {
	register,
	login,
	updateProfile,
	showOrders,
	allOrders,
} = require("../controllers/authController");
const { requireSignIn, isAdmin } = require("../middlewares/authMiddleware");

router.post("/register", register);
router.post("/login", login);

router.get("/auth-check", requireSignIn, (req, res) => {
	res.json({ ok: true });
});
router.get("/admin-check", requireSignIn, isAdmin, (req, res) => {
	res.json({ ok: true });
});

router.put("/update-profile", requireSignIn, updateProfile);

// orders
router.get("/orders", requireSignIn, showOrders);
router.get("/all-orders", requireSignIn, isAdmin, allOrders);

module.exports = router;
