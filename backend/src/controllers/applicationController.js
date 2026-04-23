const { db } = require('../services/db');

const createApplication = async (req, res) => {
  try {
    const { opportunity_id } = req.body;
    const user_id = req.user.id;

    const opportunity = db.opportunities.findOne({ id: opportunity_id });
    if (!opportunity) {
      return res.status(404).json({ error: 'Opportunity not found' });
    }

    const existing = db.applications.findOne({ user_id, opportunity_id });
    if (existing) {
      return res.status(400).json({ error: 'Already applied to this opportunity' });
    }

    const application = db.applications.insert({
      user_id,
      opportunity_id,
      status: 'applied',
      applied_at: new Date().toISOString()
    });

    // Simulate email
    console.log(`[EMAIL] Application confirmation sent to ${req.user.email} for ${opportunity.title}`);

    res.status(201).json({
      message: 'Application recorded successfully',
      application,
      redirect_url: opportunity.official_link
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getUserApplications = async (req, res) => {
  try {
    const apps = db.applications.findAll({ user_id: req.user.id }, { order: { column: 'applied_at', ascending: false } });
    
    // Enrich with opportunity data
    const enriched = apps.map(app => {
      const opp = db.opportunities.findOne({ id: app.opportunity_id });
      return { ...app, opportunity: opp || null };
    });

    res.json(enriched);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getApplication = async (req, res) => {
  try {
    const { id } = req.params;
    const app = db.applications.findOne({ id });
    if (!app) return res.status(404).json({ error: 'Not found' });
    
    const opp = db.opportunities.findOne({ id: app.opportunity_id });
    const user = db.users.findOne({ id: app.user_id });
    
    res.json({ ...app, opportunity: opp, user: user ? { id: user.id, first_name: user.first_name, last_name: user.last_name, email: user.email } : null });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const app = db.applications.update(id, { status });
    if (!app) return res.status(404).json({ error: 'Not found' });
    res.json(app);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteApplication = async (req, res) => {
  try {
    const { id } = req.params;
    const success = db.applications.delete(id, req.user.id);
    if (!success) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Application deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createApplication,
  getUserApplications,
  getApplication,
  updateStatus,
  deleteApplication
};
