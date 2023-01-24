const mongoose = require("mongoose");

const CartSchema = new mongoose.Schema(
  new mongoose.Schema({
    items: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        quantity: { type: Number, default: 1 },
      },
    ],
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  })
);

module.exports = mongoose.model("Cart", CartSchema);
