const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const jwtSecret = process.env.JWT_SECRET;

const checkEmailFormat = (email) => {
  const emailRegex = /^[a-zA-Z0-9._-]+@(gmail|hotmail)\.com$/;
  return emailRegex.test(email);
};

const checkUnder100YearsOld = (birthdate) => {
  const currentDate = new Date();

  // Reformat the date if it's in the "DD/MM/YYYY" format
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(birthdate)) {
    birthdate = birthdate.split('/').reverse().join('-');
  }

  const providedDate = new Date(birthdate);

  const ageDifference = currentDate.getFullYear() - providedDate.getFullYear();
  return ageDifference < 100;
};


// const userEmailExists = (email) => {
//       userEmailExistsQuery = `SELECT * FROM User WHERE email = ?`;

//       db.run(userEmailExistsQuery, email, (error, row) => {
//             if (error) {
//               console.error('Error when checking the user email: ', error.message);
//               res.status(500).json({ Error: 'Error checking the user email.' });
//               return;
//             }
          
//             if (row) {
//               console.error('Email already exists.');
//               return res.status(400).send({ error: 'Email already exists.' });
//             }
          
//             // Continue with user creation if the email does not exist...
//           });
// }

const validateParams = (params) => {
  return Object.values(params).every((param) => param !== undefined && param !== '');
};

const userController = {
  createUser: async (req, res, db) => {
    try {
      const {fullName, username, email, password, preferredLanguage, birthDate} = req.body;

      const isValidParams = validateParams({fullName, username, email, password, preferredLanguage, birthDate});
      const isValidEmail = checkEmailFormat(email);
      const isValidAge = checkUnder100YearsOld(birthDate);

      if (!isValidParams) {
        return res.status(400).send({Error: 'Missing required parameters!'});
      }

      if (!isValidEmail) {
        console.error('Formato de email inválido');
        return res.status(400).send({Error: 'Invalid email format!'});
      }

      if (!isValidAge) {
        console.error('Passou de 100 anos de idade');
        return res.status(400).send({Error: 'Age exceeded 100 years!'});
      }

      // const userEmailExistsQuery = `SELECT * FROM User WHERE email = ?`;
      // db.run(userEmailExistsQuery, email, (error, row) => {
      //       if (error) {
      //         console.error('Error when checking the user email: ', error.message);
      //         res.status(500).json({ Error: 'Error checking the user email.' });
      //         return;
      //       }
          
      //       if (row) {
      //         console.error('Email already exists.');
      //         return res.status(400).send({ error: 'Email already exists.' });
      //       }
          
      //     });

      const insertQuery = `
          INSERT INTO User (fullName, username, email, password, preferredLanguage, birthDate)
          VALUES (?, ?, ?, ?, ?, ?)
          `;
      const params = [fullName, username, email, password, preferredLanguage, birthDate];
      db.run(insertQuery, params, function(error) {
        if (error) {
          console.error('Error when creating the user: ', error.message);
          res.status(500).json({Error: 'Error creating the user.'});
          return;
        }
        const userId = this.lastID;
        res.status(201).json({message: 'User successfully created.', userId});
        console.log('User successfully created. ID: ', userId);
      });
    } catch (error) {
      console.log('ERROR:', error);
      res.status(500).json({Error: 'Error creating user.'});
    }
  },
};

module.exports = userController;
