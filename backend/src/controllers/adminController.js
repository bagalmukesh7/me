const supabase = require('../services/supabaseClient');

const getDashboardStats = async (req, res) => {
  try {
    const { count: totalUsers } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true });

    const { count: totalApplications } = await supabase
      .from('applications')
      .select('*', { count: 'exact', head: true });

    const { count: totalOpportunities } = await supabase
      .from('opportunities')
      .select('*', { count: 'exact', head: true });

    const { count: verifiedUsers } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })
      .eq('is_verified', true);

    const { data: recentApplications } = await supabase
      .from('applications')
      .select(`
        *,
        user:users(id, first_name, last_name, email),
        opportunity:opportunities(title, type)
      `)
      .order('applied_at', { ascending: false })
      .limit(10);

    const { data: applicationsByStatus } = await supabase
      .from('applications')
      .select('status, count:id')
      .group('status');

    res.json({
      stats: {
        totalUsers: totalUsers || 0,
        totalApplications: totalApplications || 0,
        totalOpportunities: totalOpportunities || 0,
        verifiedUsers: verifiedUsers || 0
      },
      recentApplications: recentApplications || [],
      applicationsByStatus: applicationsByStatus || []
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    const { data, error, count } = await supabase
      .from('users')
      .select('id, email, first_name, last_name, phone, state, role, is_verified, created_at', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;

    res.json({
      users: data,
      total: count,
      page: parseInt(page),
      totalPages: Math.ceil(count / limit)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllApplications = async (req, res) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    const offset = (page - 1) * limit;

    let query = supabase
      .from('applications')
      .select(`
        *,
        user:users(id, first_name, last_name, email),
        opportunity:opportunities(title, type, organization)
      `, { count: 'exact' })
      .order('applied_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (status) query = query.eq('status', status);

    const { data, error, count } = await query;

    if (error) throw error;

    res.json({
      applications: data,
      total: count,
      page: parseInt(page),
      totalPages: Math.ceil(count / limit)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateApplicationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    const { data, error } = await supabase
      .from('applications')
      .update({ status, admin_notes: notes, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getUserDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id, email, first_name, last_name, phone, state, education, role, is_verified, created_at')
      .eq('id', id)
      .single();

    if (userError) throw userError;

    const { data: applications } = await supabase
      .from('applications')
      .select(`
        *,
        opportunity:opportunities(title, type, organization)
      `)
      .eq('user_id', id)
      .order('applied_at', { ascending: false });

    res.json({
      user,
      applications: applications || []
    });
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
