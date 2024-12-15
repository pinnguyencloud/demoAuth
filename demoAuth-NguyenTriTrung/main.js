require("dotenv").config();
const express = require("express"),
  mongoose = require("mongoose"),
  expressSession = require("express-session"),
  Redis = require("ioredis"),
  RedisStore = require("connect-redis").default,
  connectFlash = require("connect-flash"),
  passport = require("passport"),
  methodOverride = require("method-override");

const authRouter = require("./routes/authRoutes");
const blogRouter = require("./routes/blogRoutes");
const clientRedis = new Redis();
const User = require("./models/user");

const app = express();
const { PORT, KEY_SESSION } = process.env;

// Kết nối tới MongoDB
mongoose.connect("mongodb://localhost:27017/authenticationDemo", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB");
});
mongoose.connection.once("error", () => {
  console.error("Error connecting to MongoDB");
});

// Cấu hình view engine và layout
const layout = require("express-ejs-layouts");
app.use(layout);
app.set("view engine", "ejs");
app.use(express.static("public"));
// Cấu hình body-parser
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
// Cấu hình session và cookie
app.use(
  expressSession({
    saveUninitialized: false,
    secret: KEY_SESSION,
    cookie: {
      maxAge: 3600 * 1000, // 1 giờ
      httpOnly: true,
      secure: false, // Thay đổi thành `true` khi sử dụng HTTPS
    },
    store: new RedisStore({ client: clientRedis }),
    resave: false,
  })
);

// Cấu hình flash messages
app.use(connectFlash());
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

// Cấu hình passport
app.use(passport.initialize());
app.use(passport.session());

//Thiết lập Strategy trước khi authentication:
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});

// Sử dụng route
app.use("/", authRouter);
app.use("/", blogRouter);

// Lắng nghe kết nối
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
