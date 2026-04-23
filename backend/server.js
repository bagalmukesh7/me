const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const authRoutes = require('./src/routes/auth');
const userRoutes = require('./src/routes/users');
const opportunityRoutes = require('./src/routes/opportunities');
const applicationRoutes = require('./src/routes/applications');
const adminRoutes = require('./src/routes/admin');
const fetcherRoutes = require('./src/routes/fetcher');

const app = express();

app.use(cors());
app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'UGOVA API is running' });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/opportunities', opportunityRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/fetcher', fetcherRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`UGOVA Backend running on port ${PORT}`);
});

module.exports = app;
