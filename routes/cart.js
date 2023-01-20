const express = require("express");

const router = express.Router();

const auth = require("../middleware/auth");

const { User } = require("../models/user");
const { Cart } = require("../models/cart");

//AUTHORIZED ROUTES
router.use(auth.authenticate);

router.post("/", (req, res) => {
  const { username, password } = req.body;
  const result = loginService.authenticate(username, password);

  if (result.error) {
    return res.status(401).json({ error: result.error });
  }
  res.status(200).json({ sessionId: result.sessionId });
});

router.post("/", async (req, res) => {
  const sessionId = req.headers["session-id"];
  const { productId, username } = req.body;

  const user = await User.findOne({ username, sessionId });
  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  //UPDATE OR INSERT + INCREASE QUANTITY BY 1
  await Cart.updateOne(
    { user: user._id, "items.product": productId },
    { $inc: { "items.$.quantity": 1 } },
    { upsert: true }
  );
  res.json({ message: "Product added to cart" });
});

router.get("/cart-size", async (req, res) => {
  const { username, sessionId } = req.query;

  // Find the user by username and sessionId
  const user = await User.findOne({ username, sessionId });

  // Find cart by user id and use aggregation to calculate the total cart size
  const totalSize = await Cart.aggregate([
    { $match: { user: user._id } },
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
