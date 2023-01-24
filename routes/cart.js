const express = require("express");

const auth = require("../middleware/auth");

const { User } = require("../models/user");
const { Cart } = require("../models/cart");
const { Product } = require("../models/product");

const router = express.Router();
//AUTHORIZED ROUTER
router.use(auth.authenticate);

router.post("/cart", async (req, res) => {
  const sessionId = req.headers["session-id"];
  const { id, title, cost, description, image, username } = req.body;

  let product = await Product.findById(id);
  if (!product) {
    product = await Product.create({ id, title, cost, description, image });
  }

  const user = await User.findOne({ username, sessionId });
  //UPDATE OR INSERT + INCREASE QUANTITY BY 1
  await Cart.updateOne(
    { user: user._id, "items.product.id": productId },
    { $inc: { "items.$.quantity": 1 } },
    { upsert: true }
  );
  res.json({ message: "Product added to cart" });
});

router.get("/cart-size", async (req, res) => {
  const sessionId = req.headers["session-id"];

  const { username } = req.query;

  // Find the user by username and sessionId
  const user = await User.findOne({ username, sessionId });

  // Find cart by user id and use aggregation to calculate the total cart size
  const totalSize = await Cart.aggregate([
    { $match: { "user._id": mongoose.Types.ObjectId(user._id) } },
    { $unwind: "$items" },
    { $group: { _id: "$user", totalSize: { $sum: "$items.quantity" } } },
  ]);

  // If cart not found, return error message
  if (!totalSize.length) {
    return res.status(404).json({ message: "Cart not found" });
  }

  // Return the total size of the cart as a JSON object
  res.status(200).json({ totalSize: totalSize[0].totalSize });
});

module.exports = router;
