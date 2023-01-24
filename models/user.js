const mongoose = require("mongoose");

const User = mongoose.model(
  "User",
  new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    sessionId: { type: String, required: false },
    cart: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cart",
      required: false,
    },
  })
);

exports.User = User;
