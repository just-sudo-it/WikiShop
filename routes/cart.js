const express = require("express");

const auth = require("../middleware/auth");

const { User } = require("../models/user");
const { Product } = require("../models/product");

const router = express.Router();
router.use(auth.authenticate);

router.post("/", async (req, res) => {
  try {
    const { product, username } = req.body;

    let dbProduct = await Product.findOne({ productId: product.id });

    if (!dbProduct) {
      dbProduct = await Product.create({
        productId: product.id,
        title: product.title,
        cost: product.cost,
        description: product.description,
        image: product.image,
      });
    }
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ message: "User not found" });
    const cart = user.cart || [];

    const productIndex = cart.findIndex((item) =>
      item?.product?.equals(dbProduct._id)
    );
    productIndex === -1
      ? cart.push({ product: dbProduct._id, quantity: 1 })
      : (cart[productIndex].quantity += 1);

    await user.save();

    return res
      .status(201)
      .json({ message: "Product added to cart", cart: user.cart });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ error });
  }
});

router.get("/size", async (req, res) => {
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
