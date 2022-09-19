const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");

//Import routes
const authRoute = require("./routes/auth");
const protectedRoute = require("./routes/protected");

dotenv.config();

//Connect to MongoDB
mongoose.connect(process.env.DB_CONNECTION, () => {
  console.log("Connected to MongoDB...");
});

//Middlewares
app.use(express.json());

//Routes Middlewares
app.use("/api/user", authRoute);
app.use("/api/protected", protectedRoute);

app.listen(5656, () => console.log("Server up and running..."));
