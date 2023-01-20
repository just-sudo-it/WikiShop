//IMPORTS
const cartRoutes = require("./routes/cart");
const accountRoutes = require("./routes/account");

const express = require("express");
const path = require("path");

//DB SET-UP
require("./DB/db.js");

//APP SET-UP
const app = express();
app.listen(8080, () => {
  console.log("server listening on port " + 8080);
});

//MIDDLEWARE
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//ROUTING
app.use("/cart", cartRoutes);

app.use("/", accountRoutes);

app.get("/", function (req, res) {
  var options = {
    root: path.join(__dirname, "public"),
  };

  res.sendFile("index.html", options, function (err) {
    console.log(err);
  });
});
