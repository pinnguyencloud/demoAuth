const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true, sparse: true, trim: true },
  name: {
    first: { type: String, trim: true },
    last: { type: String, trim: true },
  },
  zipCode: {
    type: Number,
    min: [10000, "zip code to short"],
    max: 99999,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  // courses: [
  //   {
  //     type: mongoose.Schema.Types.ObjectId,
  //     ref: "Course",
  //   },
  // ],
});

userSchema.virtual("fullName").get(function () {
  return `${this.name.first} ${this.name.last}`;
});

userSchema.plugin(passportLocalMongoose, {
  usernameField: "username",
  usernameLowerCase: true,
});

module.exports = mongoose.model("User", userSchema);
