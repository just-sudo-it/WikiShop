const uuid = require("uuid");
const users = [{ username: "test", password: "password" }]; // array of registered users
const sessions = []; // array to store active sessions

const loginService = {
  authenticate(username, password) {
    const user = users.find(
      (u) => u.username === username && u.password === password
    );
    if (!user) {
      return { error: "Invalid credentials" };
    }
    // create new session
    const sessionId = uuid.v4();
    sessions.push({ sessionId, username });

    return { sessionId };
  },
};

module.exports = loginService;
