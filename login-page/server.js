const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');  // added bcrypt
const User = require('./models/user');
const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public"));

mongoose.connect('mongodb://localhost:27017/loginDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on('connected', () => {
  console.log('Mongoose connected to MongoDB');
});

db.on('error', (err) => {
  console.error('Mongoose connection error:', err);
});

// Signup route with password hashing
app.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;

  console.log('Signup request received:', { name, email, password });

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      console.log('User already exists');
      return res.status(400).json({ success: false, message: 'User already exists', name: existingUser.name });
    }

    // Hash password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({ name, email, password: hashedPassword });
    await user.save();

    console.log('User signed up successfully');
    res.status(200).json({ success: true, message: 'User signed up successfully', name: user.name });

  } catch (err) {
    console.error('Signup error:', err);

    if (err.name === 'ValidationError') {
      return res.status(400).json({ success: false, message: 'Validation error', error: err.message });
    }

    if (err.code === 11000) {
      return res.status(400).json({ success: false, message: 'Email already exists' });
    }

    res.status(500).json({ success: false, message: 'Error signing up', error: err.message });
  }
});

// Signin route with password comparison
app.post('/signin', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Incorrect password' });
    }

    res.status(200).json({ success: true, message: 'User signed in successfully', name: user.name });

  } catch (err) {
    res.status(500).json({ success: false, message: 'Error signing in', error: err.message });
  }
});

app.listen(3000, '0.0.0.0', () => console.log('Server started on http://localhost:3000'));
