const sqlite3 = require('sqlite3');

class RetriveDBInfo {
  constructor(userId) {
    this.userId = userId;
    this.databasePath = 'LangBridge.db';
    this.db = new sqlite3.Database(this.databasePath);
  }

  static checkId(id) {
    return !isNaN(id) && parseInt(id) > 0;
  }

  getLastRequestId() {
    if (!RetriveDBInfo.checkId(this.userId)) {
      return null;
    }

    return new Promise((resolve, reject) => {
      const query = 'SELECT MAX(request_id) FROM TranslationRequest WHERE user_id = ?';
      this.db.get(query, [this.userId], (err, row) => {
        if (err) {
          console.error(`Error in getLastRequestId: ${err}`);
          reject(err);
        } else {
          resolve(row['MAX(request_id)'] || null);
        }
      });
    });
  }

  getTextContentFromDB(requestId) {
    return new Promise((resolve, reject) => {
      if (requestId === null) {
        resolve(null);
      } else {
        const query = 'SELECT translation_content FROM TranslationRequest WHERE request_id = ?';
        this.db.get(query, [requestId], (err, row) => {
          if (err) {
            console.error(`Error in getTextContentFromDB: ${err}`);
            reject(err);
          } else {
            resolve(row ? row.translation_content : null);
          }
        });
      }
    });
  }

  getLanguagesFromDB(requestId) {
    return new Promise((resolve, reject) => {
      if (requestId === null) {
        resolve(null);
      } else {
        const query = 'SELECT source_language_id, target_language_id FROM TranslationRequest WHERE request_id = ?';
        this.db.all(query, [requestId], (err, rows) => {
          if (err) {
            console.error(`Error in getLanguagesFromDB: ${err}`);
            reject(err);
          } else {
            resolve(rows);
          }
        });
      }
    });
  }
}

module.exports = RetriveDBInfo;