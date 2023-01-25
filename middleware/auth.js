const { User } = require("../models/user");

const userForSessionId = async (sessionId) => {
  return await User.findOne({ sessionId: sessionId });
};

const IsAuthorized = {
  async authenticate(req, res, next) {
    const sessionId = req.headers["session-id"] || req.body.sessionId;

    if (!sessionId || sessionId === "null" || sessionId === "undefined") {
      return res.redirect(
        "error?" +
          new URLSearchParams({
            error_title: "Unauthorized",
            error_status_code: "401",
            error_subtitle: "No session ID provided",
          }).toString()
      );
    }

    try {
      const user = await userForSessionId(sessionId);

      if (!user) {
        return res.redirect(
          "error?" +
            new URLSearchParams({
              error_title: "Error ",
              error_status_code: "404",
              error_subtitle: "Could not find User with sessionId:",
            }).toString()
        );
      } else if (!user.sessionId) {
        return res.redirect(
          "error?" +
            new URLSearchParams({
              error_title: "Error ",
              error_status_code: "404",
              error_subtitle: "Session expired.Try logging in again",
            }).toString()
        );
      }

      next();
    } catch (e) {
      console.log(e);
    }
  },
};

module.exports = IsAuthorized;
