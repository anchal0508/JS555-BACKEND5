// 5
// Shree

require('dotenv').config();

const dbConfig = {
  url: process.env.DATABASE_URL,
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  }
};

module.exports = {
  development: {
    username: process.env.SUPABASE_DB_USER,
    password: process.env.SUPABASE_DB_PASSWORD,
    database: process.env.SUPABASE_DB_NAME,
    host: process.env.SUPABASE_DB_HOST,
    port: process.env.SUPABASE_DB_PORT || 5432,
    dialect: 'postgres',
  },
  // production और test दोनों में हम सीधे URL पास कर रहे हैं ताकि कोई भ्रम न रहे
  production: dbConfig,
  test: dbConfig
};