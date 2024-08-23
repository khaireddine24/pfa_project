// models/Product.js
import { Sequelize, DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Product = sequelize.define('Product', {
  long_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  short_name: {
    type: DataTypes.STRING
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false
  },
  annee: {
    type: DataTypes.DATE
  },
  nom_client: {
    type: DataTypes.STRING
  },
  GPS: {
    type: DataTypes.STRING
  },
  years: {
    type: DataTypes.JSON, // Ensure JSON type is used
    defaultValue: [] // Default to an empty array
  }
}, {
  timestamps: false
});

export default Product;
