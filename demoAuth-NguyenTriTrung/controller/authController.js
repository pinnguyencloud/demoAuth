const User = require("../models/user");
const passport = require("passport");

module.exports = {
  indexView: (req, res) => {
    res.render("index");
  },
  createView: (req, res) => {
    res.render("createAccount");
  },
  loginView: (req, res) => {
    res.render("login");
  },
  register: async (req, res, next) => {
    try {
      const { email, password, first, last, zipCode, userName } = req.body;

      const [existingUserByUserName, existingUserByEmail] = await Promise.all([
        userName ? User.findOne({ userName: userName }) : null,
        User.findOne({ email: email }),
      ]);

      if (existingUserByUserName) {
        req.flash("error", "username đã được sử dụng");
        return res.redirect("/create");
      }

      if (existingUserByEmail) {
        req.flash("error", "Email đã được sử dụng");
        return res.redirect("/create");
      }

      const newUser = new User({
        username: userName ? userName : email,
        email: email,
        name: {
          first: first,
          last: last,
        },
        zipCode: zipCode,
      });
      await User.register(newUser, password);
      // passport.authenticate("local")(req, res, () => {
      //   res
      //     .status(201)
      //     .json({ message: "User registered successfully", user: newUser });
      // });
      req.flash("success", "Đăng ký thành công! Vui lòng đăng nhập.");
      res.redirect("/login");
    } catch (error) {
      console.error("Error registering:", error);
      req.flash("error", error.message || "Internal server error");
      res
        .status(500)
        .json({ message: error.message || "Internal server error" });
    }
  },
  login: passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/login",
  }),
  dashboardView: (req, res) => {
    res.render("dashboard", { user: req.user });
  },
  ensureAuthenticated: (req, res, next) => {
    if (req.isAuthenticated()) {
      return next();
    }
    req.flash("error", "Bạn cần đăng nhập để vào trang này.");
    res.redirect("/login");
  },
  logout: (req, res) => {
    req.logout((err) => {
      if (err) {
        console.error("Error logging out:", err);
        req.flash("error", "Có lỗi xảy ra khi đăng xuất.");
        return res.redirect("/dashboard");
      }
      req.flash("success", "Đăng xuất thành công");
      res.redirect("/");
    });
  },
};
