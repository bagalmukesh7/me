const { db } = require('../services/db');

const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = db.users.count();
    const totalApplications = db.applications.count();
    const totalOpportunities = db.opportunities.findAll().length;
    const verifiedUsers = db.users.count({ is_verified: true });

    const recentApplications = db.applications.findAll({}, { order: { column: 'applied_at', ascending: false }, limit: 10 });
    
    // Enrich with user and opportunity data
    const enriched = recentApplications.map(app => {
      const user = db.users.findOne({ id: app.user_id });
      const opp = db.opportunities.findOne({ id: app.opportunity_id });
      return {
        ...app,
        user: user ? { id: user.id, first_name: user.first_name, last_name: user.last_name, email: user.email } : null,
        opportunity: opp ? { title: opp.title, type: opp.type } : null
      };
    });

    res.json({
      stats: {
        totalUsers,
        totalApplications,
        totalOpportunities,
        verifiedUsers
      },
      recentApplications: enriched,
      applicationsByStatus: []
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    const allUsers = db.users.findAll({
      select: ['id', 'email', 'first_name', 'last_name', 'phone', 'state', 'role', 'is_verified', 'created_at'],
      order: { column: 'created_at', ascending: false },
      offset: parseInt(offset),
      limit: parseInt(limit)
    });

    res.json({
      users: allUsers,
      total: db.users.count(),
      page: parseInt(page),
      totalPages: Math.ceil(db.users.count() / limit)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllApplications = async (req, res) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    const offset = (page - 1) * limit;

    const query = {};
    if (status) query.status = status;

    const allApps = db.applications.findAll(query, { order: { column: 'applied_at', ascending: false }, limit: parseInt(limit) });
    
    // Enrich
    const enriched = allApps.map(app => {
      const user = db.users.findOne({ id: app.user_id });
      const opp = db.opportunities.findOne({ id: app.opportunity_id });
      return {
        ...app,
        user: user ? { id: user.id, first_name: user.first_name, last_name: user.last_name, email: user.email } : null,
        opportunity: opp ? { title: opp.title, type: opp.type, organization: opp.organization } : null
      };
    });

    const total = status ? db.applications.findAll(query).length : db.applications.count();

    res.json({
      applications: enriched,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateApplicationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    const app = db.applications.update(id, { status, admin_notes: notes });
    if (!app) return res.status(404).json({ error: 'Not found' });
    res.json(app);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getUserDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const user = db.users.findOne({ id });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const { password, ...userData } = user;

    const applications = db.applications.findAll({ user_id: id }, { order: { column: 'applied_at', ascending: false } });
    const enriched = applications.map(app => {
      const opp = db.opportunities.findOne({ id: app.opportunity_id });
      return { ...app, opportunity: opp ? { title: opp.title, type: opp.type, organization: opp.organization } : null };
    });

    res.json({ user: userData, applications: enriched });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getDashboardStats,
  getAllUsers,
  getAllApplications,
  updateApplicationStatus,
  getUserDetails
};
