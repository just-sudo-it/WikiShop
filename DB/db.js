const mongoose = require("mongoose");

require("dotenv").config();

mongoose.connect(process.env.DATABASE_URL);

const database = mongoose.connection;

database.on("error", (error) => {
  console.log("Database error " + error);
});
database.once("connected", () => {
  console.log("Database Connected");
});
