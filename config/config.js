require('dotenv').config();

const getDatabaseConfig = () => {
  if (process.env.DATABASE_URL) {
    return {
      "username": process.env.DB_USER,
      "password": process.env.DB_PASSWORD,
      "database": process.env.DB_NAME,
      "host": process.env.DB_HOST,
      "port": process.env.DB_PORT || 5432,
      "dialect": "postgres",
      "dialectOptions": {
        "ssl": {
          "require": true,
          "rejectUnauthorized": false
        }
      }
    };
  }

  return {
    "username": process.env.DB_USER || "root",
    "password": process.env.DB_PASSWORD || "1234",
    "database": process.env.DB_NAME || "js555",
    "host": process.env.DB_HOST || "localhost",
    "port": process.env.DB_PORT || 3306,
    "dialect": "mysql"
  };
};

const activeConfig = getDatabaseConfig();

module.exports = {
  "development": activeConfig,
  "test": activeConfig,
  "production": activeConfig
};
