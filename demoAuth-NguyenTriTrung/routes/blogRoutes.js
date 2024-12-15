const express = require("express");
const router = express.Router();
const blogController = require("../controller/blogsController");
const { ensureAuthenticated } = require("../controller/authController");

router.get("/dashboard", ensureAuthenticated, blogController.getUserBlog);
router.post("/dashboard", ensureAuthenticated, blogController.createNewBlog);
router.put("/updateBlog/:id", ensureAuthenticated, blogController.uppdateBlog);
router.delete("/delete/:id", ensureAuthenticated, blogController.deleteBlog);

module.exports = router;
