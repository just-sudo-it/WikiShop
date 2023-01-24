//IMPORTS
const cartRoutes = require("./routes/cart");
const accountRoutes = require("./routes/account");
const hbs = require("hbs");
const express = require("express");
const path = require("path");
const cors = require("cors");

require("dotenv").config();

//DB SET-UP
require("./DB/db.js");

const app = express();

//MIDDLEWARE
app.use(express.static("public"));

// Configure Handlebars as the template engine
app.set("view engine", "hbs");
// Set the views folder to 'html'
app.set("views", path.join(__dirname, "public", "html"));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors()); // add cors headers

//ROUTING
app.get("/", function (req, res) {
  var options = {
    root: path.join(__dirname, "public"),
  };

  res.sendFile("index.html", options, function (err) {
    console.log(err);
  });
});

//ERROR REDIRECTION
app.get("/error", function (req, res) {
  const { error_title, error_status_code, error_subtitle } = req.query;
  return res.status(302).render("error", {
    error_title,
    error_status_code,
    error_subtitle,
  });
});

app.use("/cart", cartRoutes);

app.use("/account", accountRoutes);

// Global exception handler middleware
app.use((err, req, res, next) => {
  // Log the error
  console.error(err);

  if (err.status >= 400 && err.status < 500) {
    return res.status(er.status).render("error", {
      error_title: err.status + "Unauthorized",
      error_subtitle: err.message,
    });
  } else {
    return res.status(500).json({ message: "An internal error occurred" });
  }
});

app.listen(8080, () => {
  console.log("server listening on port   " + 8080);
});
