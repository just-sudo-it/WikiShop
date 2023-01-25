const mongoose = require("mongoose");

const Product = mongoose.model(
  "Product",
  new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    cost: { type: Number, required: true },
    image: { type: String, required: false },
    description: { type: String, required: false },
  })
);

exports.Product = Product;
