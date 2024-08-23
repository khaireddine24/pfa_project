// controllers/productController.js
import sequelize from '../config/database.js';
import Product from '../models/Product.js';

export const addProduct = async (req, res) => {
  const { long_name, short_name, description, annee, nom_client, GPS } = req.body;

  try {
    const newProduct = await Product.create({ long_name, short_name, description, annee, nom_client, GPS, years: [] });
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getProducts = async (req, res) => {
  try {
    const products = await sequelize.query('SELECT * FROM Products', { type: sequelize.QueryTypes.SELECT });
    res.status(200).json(products); 
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getProductById = async (req, res) => {
  const { id } = req.params;

  try {
    const product = await sequelize.query('SELECT * FROM Products WHERE id = :id', {
      replacements: { id },
      type: sequelize.QueryTypes.SELECT
    });

    if (product.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.status(200).json(product[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// controllers/productController.js
export const addYear = async (req, res) => {
  const { id } = req.params;
  const { year } = req.body;

  try {
    // Find the product by its ID
    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Ensure 'years' is an array
    let years = product.years || [];
    if (!Array.isArray(years)) {
      years = [];
    }

    // Add the new year to the array if it doesn't already exist
    if (!years.includes(year)) {
      years.push(year);
    }
    
    // Update the product's years
    product.years = years;

    // Save the updated product
    await product.save();
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};