const Blog = require("../models/blog");

module.exports = {
  getUserBlog: async (req, res, next) => {
    try {
      const userId = req.user._id;
      const blogs = await Blog.find({ author: userId });
      res.render("dashboard", { blogs: blogs ? blogs : [], user: req.user });
    } catch (error) {
      console.error("Error: ", error);
      next(error);
    }
  },
  createNewBlog: async (req, res, next) => {
    try {
      const { title, content } = req.body;
      const newBlog = new Blog({
        title,
        content,
        author: req.user._id,
      });
      await newBlog.save();
      res.redirect("/dashboard");
    } catch (error) {
      console.error("Error: ", error);
      next(error);
    }
  },
  uppdateBlog: async (req, res, next) => {
    try {
      const { id } = req.params;
      const { title, content } = req.body;
      const blog = await Blog.findOneAndUpdate(
        { _id: id, author: req.user._id },
        {
          title,
          content,
        },
        { new: true }
      );
      if (!blog) {
        return res
          .status(404)
          .send("Blog không tồn tại hoặc không thuộc sở hữu của bạn.");
      }
      res.redirect("/dashboard");
    } catch (error) {
      console.error("Error:", error);
      next(error);
    }
  },
  deleteBlog: async (req, res, next) => {
    try {
      const { id } = req.params;
      const blog = await Blog.findOneAndDelete({
        _id: id,
        author: req.user._id,
      });
      if (!blog) {
        return res
          .status(404)
          .send("Blog không tồn tại hoặc không thuộc sở hữu của bạn.");
      }
      res.redirect("/dashboard");
    } catch (error) {
      console.error("Error: ", error);
      next(error);
    }
  },
};
