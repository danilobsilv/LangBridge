const sqlite3 = require('sqlite3');
const { Translate } = require('@google-cloud/translate').v2;
const fetch = require('node-fetch');

class GoogleTranslationService {
  constructor() {
    this.projectId = process.env.GOOGLE_PROJECT_ID;
    this.credentialPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
    this.db = new sqlite3.Database('LangBridge.db');
    this.translate = new Translate();
    this.location = 'global';
  }

  async translateContent(content, sourceLanguage, targetLanguage) {
    try {
      const [translation] = await this.translate.translate(content, {
        from: sourceLanguage,
        to: targetLanguage,
      });
      return translation;
    } catch (error) {
      console.error(`Error in translateContent: ${error}`);
      return null;
    }
  }

  async returnTranslatedContentToDB(translatedContent, userId, requestId) {
    try {
      const jsonData = {
        translatedText: translatedContent,
        requestId: requestId.toString(),
        userId: userId.toString(),
      };

      const createTranslatedContentEndpoint = 'http://localhost:3000/api/text';
      const response = await fetch(createTranslatedContentEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(jsonData),
      });

      console.log('json:', jsonData);
      console.log(response.status);
      console.log(await response.text());

      if (response.status === 201) {
        console.log('Content returned to the database successfully');
      } else {
        console.log('Error returning content to the database');
      }
    } catch (error) {
      console.error(`Error in returnTranslatedContentToDB: ${error}`);
      return null;
    }
  }
}

module.exports = GoogleTranslationService

ii = new GoogleTranslationService();
ii.returnTranslatedContentToDB("conteúdo traduzido kkkkk", 10, 10);