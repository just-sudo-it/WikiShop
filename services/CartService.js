const uuid = require("uuid");

const { User } = require("../models/user");

const CartService = {
  async login(username, password) {
    var user = await User.findOne({ username: username, password: password });
    if (user) {
      //LOG IN
      user.sessionId = uuid.v4();
      await user.save();

      return user.sessionId;
    } else {
      return { error: "Invalid credentials" };
    }
  },

  async logout(sessionId) {
    var user = await User.findOne({ sessionId: sessionId });
    if (user) {
      user.sessionId = null;
      await user.save();
    } else {
      return { error: "Invalid session" };
    }
    return { message: "Logout successful" };
  },

  async register(username, password) {
    var user = await User.findOne({ username: username, password: password });
    if (user) {
      return { error: "Username already exists" };
    }
    // create new session
    user = new User({
      username: username,
      sessionId: uuid.v4(),
      password: password,
    });

    await user.save();

    return user.sessionId;
  },
};
module.exports = CartService;
