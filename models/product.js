const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    cost: { type: Number, required: true },
    description: { type: String, required: false },
  })
);

module.exports = mongoose.model("Product", ProductSchema);
