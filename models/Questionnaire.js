// models/Questionnaire.js
import { Sequelize, DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Questionnaire = sequelize.define('Questionnaire', {
  client_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Products', // Assuming the Products table is used for clients
      key: 'id'
    }
  },
  responses: {
    type: DataTypes.JSON, // Store responses as JSON, including image URLs
    allowNull: false
  },
  completed: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  timestamps: true
});


export default Questionnaire;
