const fs = require('fs');
const path = require('path');

const DB_FILE = path.join(__dirname, '../../data/db.json');
const DATA_DIR = path.join(__dirname, '../../data');

// Default data
const defaultData = {
  users: [],
  opportunities: [
    {
      id: '1',
      title: 'PM Kisan Samman Nidhi',
      type: 'scheme',
      organization: 'Ministry of Agriculture',
      description: 'Direct income support of Rs. 6000 per year to farmer families',
      eligibility: 'Small and marginal farmers with landholding',
      state: 'All India',
      category: 'Agriculture',
      official_link: 'https://pmkisan.gov.in',
      last_date: '2024-12-31',
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: '2',
      title: 'SSC CGL 2024',
      type: 'exam',
      organization: 'Staff Selection Commission',
      description: 'Combined Graduate Level Examination for Group B and C posts',
      eligibility: 'Graduate from recognized university',
      state: 'All India',
      category: 'Central Government',
      official_link: 'https://ssc.nic.in',
      last_date: '2024-07-31',
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: '3',
      title: 'UPSC Civil Services 2024',
      type: 'exam',
      organization: 'Union Public Service Commission',
      description: 'Civil Services Examination for IAS, IPS, IFS posts',
      eligibility: 'Graduate, Age 21-32 years',
      state: 'All India',
      category: 'Central Government',
      official_link: 'https://upsc.gov.in',
      last_date: '2024-02-20',
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: '4',
      title: 'Bank PO Recruitment 2024',
      type: 'job',
      organization: 'State Bank of India',
      description: 'Probationary Officer recruitment in SBI',
      eligibility: 'Graduate with 60% marks',
      state: 'All India',
      category: 'Banking',
      official_link: 'https://sbi.co.in',
      last_date: '2024-09-15',
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: '5',
      title: 'Ayushman Bharat Yojana',
      type: 'scheme',
      organization: 'Ministry of Health',
      description: 'Health insurance coverage of Rs. 5 lakh per family per year',
      eligibility: 'Families below poverty line',
      state: 'All India',
      category: 'Health',
      official_link: 'https://pmjay.gov.in',
      last_date: '2024-12-31',
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: '6',
      title: 'Railway NTPC Recruitment',
      type: 'job',
      organization: 'Indian Railways',
      description: 'Non-Technical Popular Categories recruitment',
      eligibility: '12th pass or Graduate',
      state: 'All India',
      category: 'Railways',
      official_link: 'https://indianrailways.gov.in',
      last_date: '2024-10-30',
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: '7',
      title: 'Madhya Pradesh Ladli Behna Yojana',
      type: 'scheme',
      organization: 'MP Government',
      description: 'Monthly financial assistance of Rs. 1250 to women',
      eligibility: 'Women aged 21-60 years, MP resident',
      state: 'Madhya Pradesh',
      category: 'Women Welfare',
      official_link: 'https://cmladlibehna.mp.gov.in',
      last_date: '2024-12-31',
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: '8',
      title: 'DRDO Scientist B Recruitment',
      type: 'job',
      organization: 'DRDO',
      description: 'Scientist B posts in various disciplines',
      eligibility: 'BE/BTech/ME/MTech in relevant field',
      state: 'All India',
      category: 'Defence Research',
      official_link: 'https://drdo.gov.in',
      last_date: '2024-08-20',
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: '9',
      title: 'NEET UG 2024',
      type: 'exam',
      organization: 'NTA',
      description: 'National Eligibility cum Entrance Test for MBBS/BDS',
      eligibility: '12th with Physics, Chemistry, Biology',
      state: 'All India',
      category: 'Medical',
      official_link: 'https://neet.nta.nic.in',
      last_date: '2024-03-09',
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: '10',
      title: 'Pradhan Mantri Awas Yojana',
      type: 'scheme',
      organization: 'Ministry of Housing',
      description: 'Affordable housing for all by 2024',
      eligibility: 'EWS/LIG households',
      state: 'All India',
      category: 'Housing',
      official_link: 'https://pmaymis.gov.in',
      last_date: '2024-12-31',
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ],
  applications: [],
  otp_verifications: []
};

// Ensure data directory exists
function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

// Load database
function loadDB() {
  ensureDataDir();
  if (fs.existsSync(DB_FILE)) {
    try {
      const data = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
      // Ensure default opportunities exist
      if (!data.opportunities || data.opportunities.length === 0) {
        data.opportunities = [...defaultData.opportunities];
      }
      return data;
    } catch (e) {
      return { ...defaultData };
    }
  }
  return { ...defaultData };
}

// Save database
function saveDB(data) {
  ensureDataDir();
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

// In-memory store
let db = loadDB();

// Auto-save every 5 seconds
setInterval(() => saveDB(db), 5000);

// Helper functions
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
}

const dbHelpers = {
  // Users
  users: {
    findAll: (options = {}) => {
      let result = [...db.users];
      if (options.select) {
        result = result.map(u => {
          const obj = {};
          options.select.forEach(key => { if (u[key] !== undefined) obj[key] = u[key]; });
          return obj;
        });
      }
      if (options.order) {
        const { column, ascending } = options.order;
        result.sort((a, b) => {
          if (ascending) return a[column] > b[column] ? 1 : -1;
          return a[column] < b[column] ? 1 : -1;
        });
      }
      if (options.limit) result = result.slice(0, options.limit);
      if (options.offset !== undefined) result = result.slice(options.offset, options.offset + (options.limit || result.length));
      return result;
    },
    findOne: (query) => {
      return db.users.find(u => {
        for (const [key, value] of Object.entries(query)) {
          if (u[key] !== value) return false;
        }
        return true;
      }) || null;
    },
    insert: (data) => {
      const id = generateId();
      const user = { id, ...data, created_at: new Date().toISOString() };
      db.users.push(user);
      saveDB(db);
      return user;
    },
    update: (id, data) => {
      const idx = db.users.findIndex(u => u.id === id);
      if (idx === -1) return null;
      db.users[idx] = { ...db.users[idx], ...data, updated_at: new Date().toISOString() };
      saveDB(db);
      return db.users[idx];
    },
    count: (query = {}) => {
      return db.users.filter(u => {
        for (const [key, value] of Object.entries(query)) {
          if (u[key] !== value) return false;
        }
        return true;
      }).length;
    }
  },

  // Opportunities
  opportunities: {
    findAll: (query = {}) => {
      let result = [...db.opportunities];
      if (query.is_active !== undefined) result = result.filter(o => o.is_active === query.is_active);
      if (query.type) result = result.filter(o => o.type === query.type);
      if (query.state) result = result.filter(o => o.state === query.state);
      if (query.category) result = result.filter(o => o.category === query.category);
      if (query.search) {
        const term = query.search.toLowerCase();
        result = result.filter(o => o.title.toLowerCase().includes(term));
      }
      return result;
    },
    findOne: (query) => {
      return db.opportunities.find(o => {
        for (const [key, value] of Object.entries(query)) {
          if (o[key] !== value) return false;
        }
        return true;
      }) || null;
    },
    insert: (data) => {
      const id = generateId();
      const opp = { id, ...data, created_at: new Date().toISOString() };
      db.opportunities.push(opp);
      saveDB(db);
      return opp;
    },
    update: (id, data) => {
      const idx = db.opportunities.findIndex(o => o.id === id);
      if (idx === -1) return null;
      db.opportunities[idx] = { ...db.opportunities[idx], ...data, updated_at: new Date().toISOString() };
      saveDB(db);
      return db.opportunities[idx];
    },
    delete: (id) => {
      const idx = db.opportunities.findIndex(o => o.id === id);
      if (idx === -1) return false;
      db.opportunities.splice(idx, 1);
      saveDB(db);
      return true;
    }
  },

  // Applications
  applications: {
    findAll: (query = {}, options = {}) => {
      let result = [...db.applications];
      if (query.user_id) result = result.filter(a => a.user_id === query.user_id);
      if (query.opportunity_id) result = result.filter(a => a.opportunity_id === query.opportunity_id);
      if (query.status) result = result.filter(a => a.status === query.status);
      if (options.order) {
        const { column, ascending } = options.order;
        result.sort((a, b) => {
          if (ascending) return a[column] > b[column] ? 1 : -1;
          return a[column] < b[column] ? 1 : -1;
        });
      }
      if (options.limit) result = result.slice(0, options.limit);
      return result;
    },
    findOne: (query) => {
      return db.applications.find(a => {
        for (const [key, value] of Object.entries(query)) {
          if (a[key] !== value) return false;
        }
        return true;
      }) || null;
    },
    insert: (data) => {
      const id = generateId();
      const app = { id, ...data, created_at: new Date().toISOString() };
      db.applications.push(app);
      saveDB(db);
      return app;
    },
    update: (id, data) => {
      const idx = db.applications.findIndex(a => a.id === id);
      if (idx === -1) return null;
      db.applications[idx] = { ...db.applications[idx], ...data, updated_at: new Date().toISOString() };
      saveDB(db);
      return db.applications[idx];
    },
    delete: (id, user_id) => {
      const idx = db.applications.findIndex(a => a.id === id && a.user_id === user_id);
      if (idx === -1) return false;
      db.applications.splice(idx, 1);
      saveDB(db);
      return true;
    },
    count: () => db.applications.length
  },

  // OTP
  otp: {
    insert: (data) => {
      const id = generateId();
      const otp = { id, ...data, created_at: new Date().toISOString() };
      db.otp_verifications.push(otp);
      saveDB(db);
      return otp;
    },
    findOne: (query) => {
      return db.otp_verifications.find(o => {
        for (const [key, value] of Object.entries(query)) {
          if (o[key] !== value) return false;
        }
        return true;
      }) || null;
    }
  },

  // Raw access
  raw: () => db
};

module.exports = { db: dbHelpers, saveDB, loadDB };
