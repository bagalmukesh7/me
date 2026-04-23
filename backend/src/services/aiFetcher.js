const axios = require('axios');
const supabase = require('./supabaseClient');

const MOCK_OPPORTUNITIES = [
  {
    title: 'PM Kisan Samman Nidhi',
    type: 'scheme',
    organization: 'Ministry of Agriculture',
    description: 'Direct income support of Rs. 6000 per year to farmer families',
    eligibility: 'Small and marginal farmers with landholding',
    state: 'All India',
    category: 'Agriculture',
    official_link: 'https://pmkisan.gov.in',
    last_date: '2024-12-31',
    is_active: true
  },
  {
    title: 'SSC CGL 2024',
    type: 'exam',
    organization: 'Staff Selection Commission',
    description: 'Combined Graduate Level Examination for Group B and C posts',
    eligibility: 'Graduate from recognized university',
    state: 'All India',
    category: 'Central Government',
    official_link: 'https://ssc.nic.in',
    last_date: '2024-07-31',
    is_active: true
  },
  {
    title: 'UPSC Civil Services 2024',
    type: 'exam',
    organization: 'Union Public Service Commission',
    description: 'Civil Services Examination for IAS, IPS, IFS posts',
    eligibility: 'Graduate, Age 21-32 years',
    state: 'All India',
    category: 'Central Government',
    official_link: 'https://upsc.gov.in',
    last_date: '2024-02-20',
    is_active: true
  },
  {
    title: 'Bank PO Recruitment 2024',
    type: 'job',
    organization: 'State Bank of India',
    description: 'Probationary Officer recruitment in SBI',
    eligibility: 'Graduate with 60% marks',
    state: 'All India',
    category: 'Banking',
    official_link: 'https://sbi.co.in',
    last_date: '2024-09-15',
    is_active: true
  },
  {
    title: 'Ayushman Bharat Yojana',
    type: 'scheme',
    organization: 'Ministry of Health',
    description: 'Health insurance coverage of Rs. 5 lakh per family per year',
    eligibility: 'Families below poverty line',
    state: 'All India',
    category: 'Health',
    official_link: 'https://pmjay.gov.in',
    last_date: '2024-12-31',
    is_active: true
  },
  {
    title: 'Railway NTPC Recruitment',
    type: 'job',
    organization: 'Indian Railways',
    description: 'Non-Technical Popular Categories recruitment',
    eligibility: '12th pass or Graduate',
    state: 'All India',
    category: 'Railways',
    official_link: 'https://indianrailways.gov.in',
    last_date: '2024-10-30',
    is_active: true
  },
  {
    title: 'Madhya Pradesh Ladli Behna Yojana',
    type: 'scheme',
    organization: 'MP Government',
    description: 'Monthly financial assistance of Rs. 1250 to women',
    eligibility: 'Women aged 21-60 years, MP resident',
    state: 'Madhya Pradesh',
    category: 'Women Welfare',
    official_link: 'https://cmladlibehna.mp.gov.in',
    last_date: '2024-12-31',
    is_active: true
  },
  {
    title: 'DRDO Scientist B Recruitment',
    type: 'job',
    organization: 'DRDO',
    description: 'Scientist B posts in various disciplines',
    eligibility: 'BE/BTech/ME/MTech in relevant field',
    state: 'All India',
    category: 'Defence Research',
    official_link: 'https://drdo.gov.in',
    last_date: '2024-08-20',
    is_active: true
  },
  {
    title: 'NEET UG 2024',
    type: 'exam',
    organization: 'NTA',
    description: 'National Eligibility cum Entrance Test for MBBS/BDS',
    eligibility: '12th with Physics, Chemistry, Biology',
    state: 'All India',
    category: 'Medical',
    official_link: 'https://neet.nta.nic.in',
    last_date: '2024-03-09',
    is_active: true
  },
  {
    title: 'Pradhan Mantri Awas Yojana',
    type: 'scheme',
    organization: 'Ministry of Housing',
    description: 'Affordable housing for all by 2024',
    eligibility: 'EWS/LIG households',
    state: 'All India',
    category: 'Housing',
    official_link: 'https://pmaymis.gov.in',
    last_date: '2024-12-31',
    is_active: true
  }
];

const fetchAndStoreOpportunities = async () => {
  try {
    console.log('Starting AI fetcher...');
    
    // In production, this would scrape or call APIs
    // For demo, we use enriched mock data
    
    let inserted = 0;
    let updated = 0;
    
    for (const opp of MOCK_OPPORTUNITIES) {
      const { data: existing } = await supabase
        .from('opportunities')
        .select('id')
        .eq('title', opp.title)
        .eq('type', opp.type)
        .single();

      if (existing) {
        await supabase
          .from('opportunities')
          .update({
            ...opp,
            updated_at: new Date().toISOString()
          })
          .eq('id', existing.id);
        updated++;
      } else {
        await supabase
          .from('opportunities')
          .insert([{
            ...opp,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }]);
        inserted++;
      }
    }

    console.log(`AI Fetcher complete: ${inserted} inserted, ${updated} updated`);
    return { inserted, updated };
  } catch (error) {
    console.error('AI Fetcher error:', error);
    throw error;
  }
};

module.exports = { fetchAndStoreOpportunities };
