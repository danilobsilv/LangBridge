const CreateUserDTO = require('../../dtos/userDTO/createUserDTO');
const GetUserDTO = require('../../dtos/userDTO/getUserDTO');
const UpdateUserDTO = require('../../dtos/userDTO/updateUserDTO');
const DeleteUserDTO = require('../../dtos/userDTO/deleteUserDTO');
const utils = require('../utils/utils');
const bcrypt = require('bcrypt');

require('dotenv').config();
const jwtSecret = process.env.JWT_SECRET;



const validateParams = (params) => {
  const requiredFields = ['fullName', 'username', 'email', 'password', 'preferredLanguage', 'birthDate'];

  return requiredFields.every((field) => params[field] !== undefined && params[field] !== '');
};

const userServices = {
  createUser: async (req, res, db) => {
    try {
      const userDTO = new CreateUserDTO(
          req.body.fullName,
          req.body.username,
          req.body.email,
          req.body.password,
          req.body.preferredLanguage,
          req.body.birthDate,
      );


      const isValidParams = validateParams(userDTO);
      const isValidEmail = utils.checkEmailFormat(userDTO.email);
      const isValidAge = utils.checkUnder100YearsOld(userDTO.birthDate);

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
      db.get(userEmailExistsQuery, userDTO.email, (error, row) => {
        if (error) {
          console.error('Error when checking the user email: ', error.message);
          return res.status(500).json({Error: 'Error checking the user email!'});
        }

        if (row) {
          console.error('Email já existe');
          return res.status(400).json({error: 'Email already exists!'});
        }

        const hashedPassword = bcrypt.hashSync(userDTO.password, 10);
        const insertQuery = `
          INSERT INTO User (fullName, username, email, password, preferredLanguage, birthDate)
          VALUES (?, ?, ?, ?, ?, ?)
        `;
        const params = [
          userDTO.fullName,
          userDTO.username,
          userDTO.email,
          hashedPassword,
          userDTO.preferredLanguage,
          userDTO.birthDate,
        ];
        db.run(insertQuery, params, function(error) {
          if (error) {
            console.error('Error when creating the user: ', error.message);
            return res.status(500).json({Error: 'Error creating the user!'});
          }
          const userId = this.lastID;

          const token = utils.generateUserToken(userDTO.username, jwtSecret);

          res.cookie('token', token, {
            httpOnly: true,
            maxAge: 3 * 60 * 60 * 1000,
          });

          console.log('User successfully created. ID: ', userId);
          return res.status(201).json({
            message: 'User successfully created!',
            userId: userId,
            token: token,
          });
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

  getUserById: async (req, res, db) => {
    try {
      const userId = new GetUserDTO(req.params.userId);

      const getUserByIdQuery = `
            SELECT * FROM User WHERE userId = ?
          `;

      const isValidUserId = utils.checkUserId(userId.userId);

      if (!isValidUserId) {
        console.error('Erro: userId não válido');
        return res.status(400).json({erro: 'Invalid user ID!'});
      }

      db.get(getUserByIdQuery, [userId.userId], (error, user) => {
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
      const userId = new GetUserDTO(req.params.userId);

      const userDTO = new UpdateUserDTO(
          req.body.fullName,
          req.body.username,
          req.body.email,
          req.body.password,
          req.body.preferredLanguage,
          req.body.birthDate,
      );

      const fieldsToUpdate = [
        {name: 'FullName', value: userDTO.fullName},
        {name: 'Username', value: userDTO.username},
        {name: 'Email', value: userDTO.email, isValid: utils.checkEmailFormat},
        {name: 'Password', value: userDTO.password ? bcrypt.hashSync(userDTO.password, 10) : undefined},
        {name: 'PreferredLanguage', value: userDTO.preferredLanguage},
        {name: 'BirthDate', value: userDTO.birthDate, isValid: utils.checkUnder100YearsOld},
      ];

      const validFields = fieldsToUpdate.filter((field) => field.value !== undefined && (!field.isValid || field.isValid(field.value)));

      if (validFields.length === 0) {
        return res.status(400).json({message: 'No valid fields to update were provided.'});
      }

      const setStatements = validFields.map((field) => `${field.name} = ?`);
      const params = validFields.map((field) => field.value);

      if (!utils.checkUserId(userId.userId)) {
        return res.status(400).json({message: 'Invalid userId'});
      }

      params.push(userId.userId);

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

        const changes = this.changes;

        if (changes === 0) {
          return res.status(304).json({message: 'No changes were made to the user data.'});
        }

        return res.status(200).json({message: 'User updated successfully!'});
      });
    } catch (error) {
      console.error('Erro: Erro pego no catch da função updateUserById: ' + error.message);
      res.status(500).json({message: error.message});
    }
  },

  deleteUserById: async (req, res, db) =>{
    try {
      const userId = new DeleteUserDTO(req.params.userId);

      const deleteUserQuery = `
            DELETE FROM User WHERE userId = ?
          `;

      if (!utils.checkUserId(userId.userId)) {
        return res.status(400).json({message: 'Invalid userId'});
      }

      db.run(deleteUserQuery, [userId.userId], function(error) {
        if (error) {
          console.log('Erro: Erro no console no condicional do db run: ' + error.message);
          return res.status(500).json({message: 'Error while deleting user.'});
        }

        if (this.changes === 0) {
          console.log('sem mudanças');
          return res.status(404).json({message: 'User not found.'});
        }

        return res.status(200).json({message: 'User deleted successfully!'});
      });
    } catch (error) {
      console.log('Erro: Erro no bloco do catch: ' + error.message);
      res.status(500).json({message: 'Error while deleting the user.'});
    }
  },
};

module.exports = userServices;
