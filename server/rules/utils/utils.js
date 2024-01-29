const jwt = require('jsonwebtoken');

const utils = {
      checkEmailFormat: (email) => {
            const emailRegex = /^[a-zA-Z0-9._-]+@(gmail|hotmail)\.com$/;
            return emailRegex.test(email);
      },

      checkUnder100YearsOld: (birthdate) => {
            const currentDate = new Date();
          
            // p aceitar diferentes tipos de entrada
            if (/^\d{2}\/\d{2}\/\d{4}$/.test(birthdate)) {
              birthdate = birthdate.split('/').reverse().join('-');
            }
          
            const providedDate = new Date(birthdate);
          
            const ageDifference = currentDate.getFullYear() - providedDate.getFullYear();
            return ageDifference < 100;
          },

      checkUserId: (userId) => {
            return userId && !isNaN(userId) && userId > 0;
          },

      generateUserToken: (username, secret) =>{
            const tokenPayload = {
              username,
              role: 'user',
            };
          
            return jwt.sign(tokenPayload, secret);
      }
}

module.exports = utils;