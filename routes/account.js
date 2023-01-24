const express = require("express");
const router = express.Router();

const accountService = require("../services/AccountService");
const auth = require("../middleware/auth");

router.post("/register", async (req, res) => {
  const { username, password } = req.body;
  const result = await accountService.register(username, password);

  if (result.error) {
    return res.status(400).render("error", {
      error_title: res.statusCode + "\n Bad Request",
      error_subtitle: result.error,
    });
  }
  res.status(201).json({ "session-id": result.sessionId, user: result.user });
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const result = await accountService.login(username, password);

  if (result.error) {
    return res.status(401).render("error", {
      error_title: "401 Unauthorized",
      error_subtitle: result.error,
    });
  }

  res.status(200).json({ "session-id": result.sessionId, user: result.user });
});

router.post("/logout", auth.authenticate, (req, res) => {
  const sessionId = req.headers["session-id"];

  const result = accountService.logout(sessionId);

  if (result.error) {
    res.status(401).render("error", {
      error_title: "401 Unauthorized",
      error_subtitle: result.error,
    });
  }
  res.status(200).json({ message: result.message });
});

module.exports = router;
