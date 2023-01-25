require("dotenv").config();
const mongoose = require("mongoose");

mongoose.set("strictQuery", false);

const db_server = process.env.THEURL;

mongoose.connect(
  db_server,
  {
    autoIndex: false, // Don't build indexes
    serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
    socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    useUnifiedTopology: true,
    useNewUrlParser: true,
  },
  (err) => console.error("ERROR " + err)
);

mongoose.connection
  .on("error", (error) => {
    console.error(
      "Failed to connect to DB " + db_server + " on startup ",
      error
    );
  })
  .on("disconnected", (error) => {
    console.log(
      "Mongoose default connection to DB :" + db_server + " disconnected"
    );
  })
  .once("connected", () => {
    console.log("Mongoose connected to DB");
  });

// If the Node process ends, close the Mongoose connection
process.on("SIGINT" || "SIGTERM", function () {
  mongoose.connection.close(function () {
    console.log("Mongoose disconnected from DB on app termination");
    process.exit(0);
  });
});
