dotenv.config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
const User = require("./models/user");

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public"));

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/loginDB";

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Mongoose connection error:", err));

app.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;
  console.log("Signup request received:", { name, email });

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
        name: existingUser.name,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword });
    await user.save();

    res.status(200).json({
      success: true,
      message: "User signed up successfully",
      name: user.name,
    });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({
      success: false,
      message: "Error signing up",
      error: err.message,
    });
  }
});

app.post("/signin", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Incorrect password" });
    }

    res.status(200).json({
      success: true,
      message: "User signed in successfully",
      name: user.name,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error signing in",
      error: err.message,
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () =>
  console.log(`Server running on port ${PORT}`)
);
