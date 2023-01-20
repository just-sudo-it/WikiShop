const express = require("express");
const router = express.Router();

const accountService = require("../services/AccountService");
const auth = require("../middleware/auth");

router.post("/register", (req, res) => {
  const { username, password } = req.body;
  const result = accountService.register(username, password);

  if (result.error) {
    return res.status(409).send({ error: "Username already exists" });
  }
  res.status(201).send({ message: "User successfully registered" });
});

router.post("/login", (req, res) => {
  const { username, password } = req.body;
  const result = accountService.authenticate(username, password);

  if (result.error) {
    return res.status(401).json({ error: result.error });
  }
  res.status(200).json({ sessionId: result.sessionId });
  res.redirect("/");
});

router.post("/logout", auth.authenticate, (req, res) => {
  const { sessionId } = req.headers["session-id"];

  const result = accountService.logout(sessionId);

  if (result.error) {
    res.status(401).json({ error: result.error });
  }
  res.status(200).json({ message: result.message });
});

module.exports = router;
