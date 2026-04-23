const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const { db } = require('../services/db');

router.get('/me', authenticate, async (req, res) => {
  try {
    const user = db.users.findOne({ id: req.user.id });
    if (!user) return res.status(404).json({ error: 'User not found' });
    const { password, ...profile } = user;
    res.json(profile);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
