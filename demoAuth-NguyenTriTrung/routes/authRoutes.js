const express = require("express");
const router = express.Router();
const authController = require("../controller/authController");

router.get("/", authController.indexView);

// Xử lý yêu cầu đăng ký
router.get("/create", authController.createView);
router.post("/create", authController.register);

router.get("/login", authController.loginView);
router.post("/login", authController.login);
router.get("/logout", authController.logout);

module.exports = router;
