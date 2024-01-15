const sqlite3 = require("sqlite3").verbose();

const database = new sqlite3.Database('LangBridge.db', (error) => {
  if (error) {
    console.error('Error connecting to the database:', error.message);
  } else {
    console.log('Successfully connected to the database.');
  }
});

module.exports = database;