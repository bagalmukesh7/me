const { fetchAndStoreOpportunities } = require('../services/aiFetcher');

const triggerFetch = async (req, res) => {
  try {
    const result = await fetchAndStoreOpportunities();
    res.json({
      message: 'AI fetcher completed successfully',
      result
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { triggerFetch };
