import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Server } from 'socket.io';
import http from 'http';
import sequelize from './config/database.js';
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import questionnaireRoutes from './routes/questionnaireRoutes.js';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

dotenv.config();

// Get the directory name from import.meta.url
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

const createUsersTableQuery = `
  CREATE TABLE IF NOT EXISTS Users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
  );
`;

const createProductsTableQuery = `
  CREATE TABLE IF NOT EXISTS Products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    long_name VARCHAR(255) NOT NULL,
    short_name VARCHAR(255),
    description VARCHAR(255) NOT NULL,
    annee DATE,
    nom_client VARCHAR(255),
    GPS VARCHAR(255),
    years JSON,
    questionnaireCompleted BOOLEAN DEFAULT false
  );
`;

const createQuestionnairesTableQuery = `
  CREATE TABLE IF NOT EXISTS Questionnaires (
    id INT AUTO_INCREMENT PRIMARY KEY,
    client_id INT,
    responses JSON,
    completed BOOLEAN DEFAULT false,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (client_id) REFERENCES Products(id) ON DELETE CASCADE ON UPDATE CASCADE
  );
`;

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api', questionnaireRoutes);

io.on('connection', (socket) => {
  console.log('A user connected');
  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

const PORT = process.env.PORT || 3001; // Changed from 3306

// Authenticate database connection
sequelize.authenticate()
  .then(() => console.log('MySQL connected'))
  .catch(err => {
    console.error('Unable to connect to the database:', err);
    process.exit(1);
  });

// Create tables in sequence
sequelize.query(createUsersTableQuery)
  .then(() => {
    console.log('Users table created');
    return sequelize.query(createProductsTableQuery);
  })
  .then(() => {
    console.log('Products table created');
    return sequelize.query(createQuestionnairesTableQuery);
  })
  .then(() => {
    console.log('Questionnaires table created');
    // Start the server after tables are created
    server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => {
    console.error('Error setting up database or starting server:', err);
    process.exit(1);
  });