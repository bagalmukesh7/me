const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const supabase = require('../services/supabaseClient');
const { sendOTP } = require('../services/emailService');

const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

const register = async (req, res) => {
  try {
    const { email, password, first_name, last_name, phone, state, education } = req.body;

    const { data: existingUser } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const { data: user, error } = await supabase
      .from('users')
      .insert([{
        email,
        password: hashedPassword,
        first_name,
        last_name,
        phone,
        state,
        education,
        role: 'user',
        is_verified: false,
        created_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) throw error;

    const token = generateToken(user.id);

    res.status(201).json({
      message: 'Registration successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !user) {
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
    const { data: user, error } = await supabase
      .from('users')
      .select('id, email, first_name, last_name, phone, state, education, role, is_verified, created_at')
      .eq('id', req.user.id)
      .single();

    if (error) throw error;
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateProfile = async (req, res) => {
  try {
    const updates = req.body;
    delete updates.password;
    delete updates.role;

    const { data: user, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', req.user.id)
      .select()
      .single();

    if (error) throw error;
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const sendMobileOTP = async (req, res) => {
  try {
    const { phone } = req.body;
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await supabase
      .from('otp_verifications')
      .insert([{
        user_id: req.user.id,
        phone,
        otp,
        expires_at: new Date(Date.now() + 10 * 60 * 1000).toISOString()
      }]);

    // For demo, we also send to email since we can't send SMS
    await sendOTP(req.user.email, otp);

    res.json({ message: 'OTP sent successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const verifyMobileOTP = async (req, res) => {
  try {
    const { phone, otp } = req.body;

    const { data: verification, error } = await supabase
      .from('otp_verifications')
      .select('*')
      .eq('user_id', req.user.id)
      .eq('phone', phone)
      .eq('otp', otp)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error || !verification) {
      return res.status(400).json({ error: 'Invalid OTP' });
    }

    if (new Date(verification.expires_at) < new Date()) {
      return res.status(400).json({ error: 'OTP expired' });
    }

    await supabase
      .from('users')
      .update({ phone, is_verified: true })
      .eq('id', req.user.id);

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
