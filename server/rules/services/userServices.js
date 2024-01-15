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
    
    const checkUserId = (userId) => {
      return userId && !isNaN(userId) && userId > 0;
    };
    
    const validateParams = (params) => {
      return Object.values(params).every((param) => param !== undefined && param !== '');
    };
    
    const generateToken = (username, secret) =>{
      const tokenPayload = {
        username,
        role: 'user',
      };
    
      return jwt.sign(tokenPayload, secret);
    };
    


const userServices = {
      createUser: async (req, res, db) => {
        try {
          const {fullName, username, email, password, preferredLanguage, birthDate} = req.body;
    
          const isValidParams = validateParams({fullName, username, email, password, preferredLanguage, birthDate});
          const isValidEmail = checkEmailFormat(email);
          const isValidAge = checkUnder100YearsOld(birthDate);
    
          if (!isValidParams) {
            return res.status(400).json({Error: 'Missing required parameters!'});
          }
    
          if (!isValidEmail) {
            console.error('Formato de email inválido');
            return res.status(400).json({Error: 'Invalid email format!'});
          }
    
          if (!isValidAge) {
            console.error('Passou de 100 anos de idade');
            return res.status(400).json({Error: 'Age exceeded 100 years!'});
          }
    
          const userEmailExistsQuery = `SELECT * FROM User WHERE email = ?`;
          db.get(userEmailExistsQuery, email, (error, row) => {
            if (error) {
              console.error('Error when checking the user email: ', error.message);
              return res.status(500).json({Error: 'Error checking the user email!'});
            }
    
            if (row) {
              console.error('Email já existe');
              return res.status(400).json({error: 'Email already exists!'});
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
                return res.status(500).json({Error: 'Error creating the user!'});
              }
              const userId = this.lastID;
    
              const token = generateToken(username, jwtSecret);
    
              res.cookie('token', token, {
                httpOnly: true,
                maxAge: 3 * 60 * 60 * 1000,
              });
    
              console.log('User successfully created. ID: ', userId);
              return res.status(201).json({message: 'User successfully created!', userId: userId, token: token});
            });
          });
        } catch (error) {
          console.log('ERROR:', error);
          return res.status(500).json({Error: 'Error creating user ' + error.message});
        }
      },
    
      getAllUsers: async (req, res, db) =>{
        try {
          const page = req.query.page || 1;
          const limit = req.query.limit || 10;
          const offset = (page - 1) * limit;
    
          const getAllQuery = `
          SELECT * FROM User LIMIT ? OFFSET ?
          `;
    
          db.all(getAllQuery, [limit, offset], (error, users) => {
            if (error) {
              console.error('Erro: erro na condicional do db all: ' + error.message);
              return res.status(500).json({error: error.message});
            }
    
            if (!users || users.length === 0) {
              console.error('Erro: erro na verificação de usuários: sem users');
              return res.status(200).json([], {message: 'No users found!'});
            } else {
              return res.status(200).json(users);
            }
          });
        } catch (error) {
          console.error('Erro:  erro no catch do getAllUsers:  ' + error.message);
          return res.status(500).json({error: error.message});
        }
      },
    
      getUserById: async (req, res, db)=>{
        try {
          const getUserByIdQuery = `
          SELECT * FROM User WHERE userId = ?
          `;
          const userId = req.params.userId;
          const isValidUserId = checkUserId(userId);
    
          if (!isValidUserId) {
            console.error('Erro: userId não válido');
            return res.status(400).json({erro: 'Invalid user ID!'});
          }
    
          db.get(getUserByIdQuery, [userId], (error, user) => {
            if (error) {
              console.error('Erro: erro no condicional do db get ' + error.message);
              return res.status(500).json({error: error.message});
            }
            if (!user) {
              console.error('Erro: erro no condicional do db get: usuário não encontrado');
              return res.status(404).json({error: 'User not found!'});
            }
            return res.status(200).json({user: user});
          });
        } catch (error) {
          console.error('Erro: erro do bloco catch:  ' + error.message);
          return res.status(500).json({Error: error.message});
        }
      },
    
      updateUserById: async (req, res, db) => {
        try {
          const userId = req.params.userId;
          const {fullName, username, email, password, preferredLanguage, birthDate} = req.body;
    
          const fieldsToUpdate = [
            {name: 'FullName', value: fullName},
            {name: 'Username', value: username},
            {name: 'Email', value: email, isValid: checkEmailFormat},
            {name: 'Password', value: password ? bcrypt.hashSync(password, 10) : undefined},
            {name: 'PreferredLanguage', value: preferredLanguage},
            {name: 'BirthDate', value: birthDate, isValid: checkUnder100YearsOld},
          ];
    
          const validFields = fieldsToUpdate.filter((field) => field.value !== undefined && (!field.isValid || field.isValid(field.value)));
    
          if (validFields.length === 0) {
            return res.status(400).json({message: 'No valid fields to update were provided.'});
          }
    
          const setStatements = validFields.map((field) => `${field.name} = ?`);
          const params = validFields.map((field) => field.value);
    
          if (!checkUserId(userId)) {
            return res.status(400).json({message: 'Invalid userId'});
          }
    
          params.push(userId);
    
          const updateUserQuery = `
          UPDATE User
          SET ${setStatements.join(', ')}
          WHERE userId = ?
        `;
    
          db.run(updateUserQuery, params, function(error) {
            if (error) {
              console.error('Erro: Erro na execução da consulta de atualização do usuário: ' + error.message);
              return res.status(500).json({message: error.message});
            }
    
            if (this.changes === 0) {
              return res.status(304).json({message: 'No changes were made to the user data.'});
            }
    
            return res.status(200).json({message: 'User updated successfully!'});
          });
        } catch (error) {
          console.error('Erro: Erro na função updateUserById: ' + error.message);
          res.status(500).json({message: error.message});
        }
      },
    
      deleteUserById: async (req, res, db) =>{
        try {
          const userId = req.params.userId;
          const deleteUserQuery = `
            DELETE FROM User WHERE userId = ?
          `;
          db.run(deleteUserQuery, [userId], function(error) {
            if (error) {
              console.log('Erro: Erro no console no condicional do db run: ' + error.message);
              return res.status(500).json({message: 'Error while deleting user.'});
            }
    
            if (this.changes === 0) {
              console.log("sem mudanças")
              return res.status(404).json({message: 'User not found.'});
            }
    
            return res.status(200).json({message: 'User deleted successfully!'});
          });
        } catch (error) {
          console.log('Erro: Erro no bloco do catch: ' + error.message);
          res.status(500).json({message: 'Error while deleting the user.'});
        }
      }
}

module.exports = userServices;