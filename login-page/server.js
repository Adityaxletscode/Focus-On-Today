const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const bcrypt = require("bcrypt");
const User = require("./models/user");
require("dotenv").config();

const app = express();

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST"],
  })
);
app.use(bodyParser.json());
app.use(express.static("public"));

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.get("/", (req, res) => {
  res.send("Backend is running successfully 🚀");
});

app.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ success: false, message: "All fields are required" });
  }

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
    res.status(500).json({
      success: false,
      message: "Error signing up",
      error: err.message,
    });
  }
});

app.post("/signin", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ success: false, message: "Email and password are required" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res
        .status(401)
        .json({ success: false, message: "Incorrect password" });

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
  console.log(`Server running on http://localhost:${PORT}`)
);
