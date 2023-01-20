const express = require("express");
const path = require("path");
// MY DEPENDENCIES
const loginService = require("./services/LoginService");

const app = express();
const port = 8080;

app.listen(port);

/* 
    Serve static content from directory "public",
    it will be accessible under path /, 
    e.g. http://localhost:8080/index.html
*/
app.use(express.static("public"));

// parse url-encoded content from body
app.use(express.urlencoded({ extended: false }));

// parse application/json content from body
app.use(express.json());

// serve index.html as content root
app.get("/", function (req, res) {
  var options = {
    root: path.join(__dirname, "public"),
  };

  res.sendFile("index.html", options, function (err) {
    console.log(err);
  });
});

app.get("/about-us", (req, res) => {
  res.sendFile(__dirname + "/public/html/about-us"),
    function (err) {
      console.log(err);
    };
});

app.post("/login", (req, res) => {
  const { username, password } = req.body;
  const result = loginService.authenticate(username, password);
  if (result.error) {
    return res.status(401).json({ error: result.error });
  }
  res.status(200).json({ sessionId: result.sessionId });
});

app.post("/logout", (req, res) => {
  const { sessionId } = req.body;
  const result = loginService.logout(sessionId);
  if (result.error) {
    res.status(401).json({ error: result.error });
  }
  res.status(200).json({ message: result.message });
});

app.post("/register", (req, res) => {
  const { username } = req.body;
  const result = loginService.register(username);

  if (result.error) {
    return res.status(409).send({ error: "Username already exists" });
  }
  res.status(201).send({ message: "User successfully registered" });
});
