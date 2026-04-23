const supabase = require('../services/supabaseClient');

const listOpportunities = async (req, res) => {
  try {
    const { type, state, category, search } = req.query;
    
    let query = supabase
      .from('opportunities')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (type) query = query.eq('type', type);
    if (state) query = query.eq('state', state);
    if (category) query = query.eq('category', category);
    if (search) query = query.ilike('title', `%${search}%`);

    const { data, error } = await query;

    if (error) throw error;
    res.json(data || []);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getOpportunity = async (req, res) => {
  try {
    const { id } = req.params;
    
    const { data, error } = await supabase
      .from('opportunities')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createOpportunity = async (req, res) => {
  try {
    const opportunity = req.body;
    
    const { data, error } = await supabase
      .from('opportunities')
      .insert([opportunity])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateOpportunity = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const { data, error } = await supabase
      .from('opportunities')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteOpportunity = async (req, res) => {
  try {
    const { id } = req.params;
    
    const { error } = await supabase
      .from('opportunities')
      .delete()
      .eq('id', id);

    if (error) throw error;
    res.json({ message: 'Opportunity deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getStates = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('opportunities')
      .select('state')
      .not('state', 'is', null);

    if (error) throw error;
    const states = [...new Set(data.map(d => d.state))].filter(Boolean);
    res.json(states);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getCategories = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('opportunities')
      .select('category')
      .not('category', 'is', null);

    if (error) throw error;
    const categories = [...new Set(data.map(d => d.category))].filter(Boolean);
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
