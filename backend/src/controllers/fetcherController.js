const { db } = require('../services/db');

const DEMO_OPPORTUNITIES = [
  {
    title: 'UPSC Engineering Services 2024',
    type: 'exam',
    organization: 'UPSC',
    description: 'Engineering Services Examination for Group A posts',
    eligibility: 'BE/BTech in Engineering',
    state: 'All India',
    category: 'Engineering',
    official_link: 'https://upsc.gov.in',
    last_date: '2024-10-15',
    is_active: true
  },
  {
    title: 'Indian Navy Sailor Recruitment',
    type: 'job',
    organization: 'Indian Navy',
    description: 'Matric Recruit (MR) and Non Matric Recruit (NMR) posts',
    eligibility: '10th pass',
    state: 'All India',
    category: 'Defence',
    official_link: 'https://joinindiannavy.gov.in',
    last_date: '2024-11-20',
    is_active: true
  },
  {
    title: 'PM Fasal Bima Yojana',
    type: 'scheme',
    organization: 'Ministry of Agriculture',
    description: 'Crop insurance scheme for farmers',
    eligibility: 'Farmers growing notified crops',
    state: 'All India',
    category: 'Agriculture',
    official_link: 'https://pmfby.gov.in',
    last_date: '2024-12-31',
    is_active: true
  },
  {
    title: 'CTET 2024 December',
    type: 'exam',
    organization: 'CBSE/NTA',
    description: 'Central Teacher Eligibility Test',
    eligibility: 'Graduate with B.Ed or equivalent',
    state: 'All India',
    category: 'Teaching',
    official_link: 'https://ctet.nic.in',
    last_date: '2024-11-30',
    is_active: true
  },
  {
    title: 'ISRO Scientist/Engineer Recruitment',
    type: 'job',
    organization: 'ISRO',
    description: 'Scientist/Engineer SC posts',
    eligibility: 'BE/BTech in relevant field with 65% marks',
    state: 'All India',
    category: 'Space Research',
    official_link: 'https://isro.gov.in',
    last_date: '2024-12-10',
    is_active: true
  }
];

const triggerFetch = async (req, res) => {
  try {
    let inserted = 0;
    let updated = 0;
    
    for (const opp of DEMO_OPPORTUNITIES) {
      const existing = db.opportunities.findOne({ title: opp.title, type: opp.type });
      
      if (existing) {
        db.opportunities.update(existing.id, { ...opp, updated_at: new Date().toISOString() });
        updated++;
      } else {
        db.opportunities.insert({
          ...opp,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
        inserted++;
      }
    }

    res.json({
      message: 'AI fetcher completed successfully',
      result: { inserted, updated, total: db.opportunities.findAll().length }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { triggerFetch };
