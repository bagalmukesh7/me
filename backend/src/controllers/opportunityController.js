const { db } = require('../services/db');

const listOpportunities = async (req, res) => {
  try {
    const { type, state, category, search } = req.query;
    
    const query = {};
    if (type) query.type = type;
    if (state) query.state = state;
    if (category) query.category = category;
    if (search) query.search = search;

    const data = db.opportunities.findAll(query);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getOpportunity = async (req, res) => {
  try {
    const { id } = req.params;
    const data = db.opportunities.findOne({ id });
    if (!data) return res.status(404).json({ error: 'Not found' });
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createOpportunity = async (req, res) => {
  try {
    const opportunity = db.opportunities.insert(req.body);
    res.status(201).json(opportunity);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateOpportunity = async (req, res) => {
  try {
    const { id } = req.params;
    const data = db.opportunities.update(id, req.body);
    if (!data) return res.status(404).json({ error: 'Not found' });
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteOpportunity = async (req, res) => {
  try {
    const { id } = req.params;
    const success = db.opportunities.delete(id);
    if (!success) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Opportunity deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getStates = async (req, res) => {
  try {
    const data = db.opportunities.findAll();
    const states = [...new Set(data.map(d => d.state).filter(Boolean))];
    res.json(states);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getCategories = async (req, res) => {
  try {
    const data = db.opportunities.findAll();
    const categories = [...new Set(data.map(d => d.category).filter(Boolean))];
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  listOpportunities,
  getOpportunity,
  createOpportunity,
  updateOpportunity,
  deleteOpportunity,
  getStates,
  getCategories
};
