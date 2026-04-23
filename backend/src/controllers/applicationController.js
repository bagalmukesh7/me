const supabase = require('../services/supabaseClient');
const { sendApplicationEmail } = require('../services/emailService');

const createApplication = async (req, res) => {
  try {
    const { opportunity_id } = req.body;
    const user_id = req.user.id;

    // Get opportunity details
    const { data: opportunity, error: oppError } = await supabase
      .from('opportunities')
      .select('*')
      .eq('id', opportunity_id)
      .single();

    if (oppError || !opportunity) {
      return res.status(404).json({ error: 'Opportunity not found' });
    }

    // Check if already applied
    const { data: existing } = await supabase
      .from('applications')
      .select('*')
      .eq('user_id', user_id)
      .eq('opportunity_id', opportunity_id)
      .single();

    if (existing) {
      return res.status(400).json({ error: 'Already applied to this opportunity' });
    }

    // Create application record
    const { data: application, error } = await supabase
      .from('applications')
      .insert([{
        user_id,
        opportunity_id,
        status: 'applied',
        applied_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) throw error;

    // Send confirmation email
    await sendApplicationEmail(req.user.email, opportunity);

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
    const { data, error } = await supabase
      .from('applications')
      .select(`
        *,
        opportunity:opportunities(*)
      `)
      .eq('user_id', req.user.id)
      .order('applied_at', { ascending: false });

    if (error) throw error;
    res.json(data || []);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getApplication = async (req, res) => {
  try {
    const { id } = req.params;
    
    const { data, error } = await supabase
      .from('applications')
      .select(`
        *,
        opportunity:opportunities(*),
        user:users(id, first_name, last_name, email)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const { data, error } = await supabase
      .from('applications')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteApplication = async (req, res) => {
  try {
    const { id } = req.params;
    
    const { error } = await supabase
      .from('applications')
      .delete()
      .eq('id', id)
      .eq('user_id', req.user.id);

    if (error) throw error;
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
