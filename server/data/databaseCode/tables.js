const db = require("./dbConnection");

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS Text (
        text_id INTEGER PRIMARY KEY AUTOINCREMENT,
        content TEXT
      )`);
    
  db.run(`CREATE TABLE IF NOT EXISTS User (
        userId INTEGER PRIMARY KEY AUTOINCREMENT,
        fullName TEXT,
        username TEXT,
        email TEXT,
        password TEXT,
        preferredLanguage INTEGER,
        birthDate TEXT,
        FOREIGN KEY(preferredLanguage) REFERENCES Language(language_id)
      )`);

  db.run(`CREATE TABLE IF NOT EXISTS TranslationRequest (
        request_id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        text_id INTEGER,
        source_language_id INTEGER,
        target_language_id INTEGER,
        request_date TEXT,
        translation_tone TEXT,
        FOREIGN KEY(user_id) REFERENCES User(userId),
        FOREIGN KEY(text_id) REFERENCES Text(text_id),
        FOREIGN KEY(source_language_id) REFERENCES Language(language_id),
        FOREIGN KEY(target_language_id) REFERENCES Language(language_id)
      )`);

  db.run(`CREATE TABLE IF NOT EXISTS TranslationResponse (
        response_id INTEGER PRIMARY KEY AUTOINCREMENT,
        request_id INTEGER,
        translated_text TEXT,
        confidence_level REAL,
        additional_info TEXT,
        FOREIGN KEY(request_id) REFERENCES TranslationRequest(request_id)
      )`);

  db.run(`CREATE TABLE IF NOT EXISTS ErrorLog (
        error_id INTEGER PRIMARY KEY AUTOINCREMENT,
        request_id INTEGER,
        error_message TEXT,
        timestamp TEXT,
        FOREIGN KEY(request_id) REFERENCES TranslationRequest(request_id)
      )`);

  console.log('Tables created successfully!');

  db.close();

},
);