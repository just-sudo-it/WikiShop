const uuid = require("uuid");

const { User } = require("../models/user");

const AccountService = {
  async login(username, password) {
    try {
      var user = await User.findOne({ username: username, password: password });
      if (user) {
        //LOG IN
        user.sessionId = uuid.v4();
        await user.save();

        return { sessionId: user.sessionId, user: user };
      } else {
        return { error: "Invalid credentials" };
      }
    } catch (err) {
      return { error: "Not found " + err };
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
    if (username.length < 4 || password.length < 4) {
      return { error: "Username and password must be at least 4 characters" };
    }
    var user = await User.findOne({ username: username });
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

    return { sessionId: user.sessionId, user: user };
  },
};
module.exports = AccountService;
