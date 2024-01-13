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

  // p aceitar diferentes tipos de entrada
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(birthdate)) {
    birthdate = birthdate.split('/').reverse().join('-');
  }

  const providedDate = new Date(birthdate);

  const ageDifference = currentDate.getFullYear() - providedDate.getFullYear();
  return ageDifference < 100;
};

const validateParams = (params) => {
  return Object.values(params).every((param) => param !== undefined && param !== '');
};

const generateToken = (username, secret) =>{
  const tokenPayload = {
    username,
    role: "user"
  }

  const options = {
    expiresIn: '3h',
  };

  return jwt.sign(tokenPayload,  secret, options);
}

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
    
          const userEmailExistsQuery = `SELECT * FROM User WHERE email = ?`;
          db.get(userEmailExistsQuery, email, (error, row) => {
            if (error) {
              console.error('Error when checking the user email: ', error.message);
              res.status(500).json({ Error: 'Error checking the user email!' });
              return;
            }
          
            if (row) {
              console.error('Email já existe');
              return res.status(400).send({ error: 'Email already exists!' });
            }
            
            const hashedPassword = bcrypt.hash(password, 10);
            const insertQuery = `
              INSERT INTO User (fullName, username, email, password, preferredLanguage, birthDate)
              VALUES (?, ?, ?, ?, ?, ?)
              `;
            const params = [fullName, username, email, hashedPassword, preferredLanguage, birthDate];
            db.run(insertQuery, params, function(error) {
              if (error) {
                console.error('Error when creating the user: ', error.message);
                res.status(500).json({Error: 'Error creating the user!'});
                return;
              }
              const userId = this.lastID;
              
              const token = generateToken(username, jwtSecret);
              res.status(201).json({message: 'User successfully created!', userId, token: token});
              console.log('User successfully created. ID: ', userId);
            });
          });
        } catch (error) {
          console.log('ERROR:', error);
          res.status(500).json({Error: 'Error creating user ' + error.message});
        }
      },
    };
    

module.exports = userController