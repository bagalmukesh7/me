const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { db } = require('../services/db');
const { JWT_SECRET } = require('../middleware/auth');

const generateToken = (userId) => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
};

const register = async (req, res) => {
  try {
    const { email, password, first_name, last_name, phone, state, education } = req.body;

    const existingUser = db.users.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = db.users.insert({
      email,
      password: hashedPassword,
      first_name,
      last_name,
      phone: phone || null,
      state: state || null,
      education: education || null,
      role: email === 'admin@ugova.gov.in' ? 'admin' : 'user',
      is_verified: false,
      is_active: true
    });

    const token = generateToken(user.id);

    res.status(201).json({
      message: 'Registration successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        role: user.role,
        is_verified: user.is_verified
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = db.users.findOne({ email });
    if (!user || !user.password) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = generateToken(user.id);

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        role: user.role,
        is_verified: user.is_verified
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getProfile = async (req, res) => {
  try {
    const user = db.users.findOne({ id: req.user.id });
    if (!user) return res.status(404).json({ error: 'User not found' });
    
    const { password, ...profile } = user;
    res.json(profile);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateProfile = async (req, res) => {
  try {
    const updates = req.body;
    delete updates.password;
    delete updates.role;

    const user = db.users.update(req.user.id, updates);
    if (!user) return res.status(404).json({ error: 'User not found' });
    
    const { password, ...profile } = user;
    res.json(profile);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const sendMobileOTP = async (req, res) => {
  try {
    const { phone } = req.body;
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    db.otp.insert({
      user_id: req.user.id,
      phone,
      otp,
      expires_at: new Date(Date.now() + 10 * 60 * 1000).toISOString()
    });

    res.json({ message: 'OTP sent successfully', otp }); // OTP returned for demo
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const verifyMobileOTP = async (req, res) => {
  try {
    const { phone, otp } = req.body;

    const verification = db.otp.findOne({ 
      user_id: req.user.id, 
      phone, 
      otp 
    });

    if (!verification) {
      return res.status(400).json({ error: 'Invalid OTP' });
    }

    if (new Date(verification.expires_at) < new Date()) {
      return res.status(400).json({ error: 'OTP expired' });
    }

    db.users.update(req.user.id, { phone, is_verified: true });

    res.json({ message: 'Mobile number verified successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  register,
  login,
  getProfile,
  updateProfile,
  sendMobileOTP,
  verifyMobileOTP
};
