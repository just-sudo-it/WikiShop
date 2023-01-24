const mongoose = require("mongoose");

require("dotenv").config();

mongoose.connect(process.env.DATABASE_URL, (err) =>
  console.error("ERROR " + err)
);

const database = mongoose.connection;

database.on("error", (error) => {
  console.log("Database error !!" + error);
});
database.once("connected", () => {
  console.log("Database Connected!! ");
});
