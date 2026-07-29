const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const savedCitySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    country: { type: String },
    lat: { type: Number, required: true },
    lon: { type: Number, required: true },
    addedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const searchHistoryEntrySchema = new mongoose.Schema(
  {
    query: { type: String, required: true },
    lat: { type: Number },
    lon: { type: Number },
    searchedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Enter a valid email address"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
      select: false,
    },
    savedCities: [savedCitySchema],
    searchHistory: [searchHistoryEntrySchema],
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Instance method to compare passwords
userSchema.methods.matchPassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
