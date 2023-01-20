const uuid = require("uuid");
const users = [{ username: "test", password: "password" }]; // array of registered users
const sessions = new Map(); //active sessions

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

  logout(sessionId) {
    // Find the session by its ID
    if (!sessions.has(sessionId)) {
      return { error: "Invalid session" };
    }
    // Remove the session from the sessions Map
    sessions.delete(sessionId);
    return { message: "Logout successful" };
  },

  register(username) {
    // Check if the user already exists
    const existingUser = users.find((u) => u.username === username);
    if (existingUser) {
      return { error: "Username already exists" };
    }

    // Hash the password here before storing it
    // You can use bcrypt or any other library for this
    // For example:
    //const hashedPassword = bcrypt.hashSync(password, 10);

    users.push({ username, password: hashedPassword });
    return { message: "Register successful" };
  },
};

module.exports = loginService;
