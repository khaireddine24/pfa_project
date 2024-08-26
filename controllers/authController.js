import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import sequelize from '../config/database.js';

const JWT_SECRET = 'your_jwt_secret'; // Replace with your secret

export const signup = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const insertUserQuery = `
      INSERT INTO Users (email, password) VALUES (:email, :password);
    `;
    await sequelize.query(insertUserQuery, {
      replacements: { email, password: hashedPassword }
    });
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    const selectUserQuery = `
      SELECT * FROM Users WHERE email = :email;
    `;
    const users = await sequelize.query(selectUserQuery, {
      replacements: { email },
      type: sequelize.QueryTypes.SELECT
    });

    const user = users[0];

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
