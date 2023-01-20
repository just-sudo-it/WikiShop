const { User } = require("../models/user");

const userForSessionId = async (sessionId) => {
  return await User.findOne({ sessionId: req.headers["session-id"] });
};

const IsAuthorized = {
  async authenticate(req, res, next) {
    const sessionId = req.headers["session-id"];

    if (!sessionId) {
      return res
        .status(401)
        .json({ error: "Unauthorized: No session ID provided" });
    }

    try {
      const user = await userForSessionId(sessionId);
      if (!user) {
        return res
          .status(404)
          .json({ error: "Could not find User with sessionId:" + sessionId });
      }
      next();
    } catch (e) {
      return res.status(401).json({ error: e });
    }
  },
};

module.exports = IsAuthorized;
