// controllers/questionnaireController.js
import sequelize from '../config/database.js';
import Questionnaire from '../models/Questionnaire.js';
import Product from '../models/Product.js';
import path from 'path';
import fs from 'fs';

export const submitQuestionnaire = async (req, res) => {
  console.log('Files:', req.files); // Log incoming files
  console.log('Body:', req.body); // Log form fields

  const { client_id } = req.body;
  const responses = JSON.parse(req.body.responses); // Convert JSON string to object

  if (!client_id || !responses || !Array.isArray(responses)) {
    return res.status(400).json({ message: 'Invalid request data' });
  }

  try {
    const updatedResponses = responses.map((response, index) => {
      const imageFile = req.files[`image${index}`];
      return {
        ...response,
        image: imageFile ? `/uploads/${imageFile[0].filename}` : null
      };
    });

    const newQuestionnaire = await Questionnaire.create({
      client_id,
      responses: updatedResponses,
      completed: true,
    });

    await sequelize.query('UPDATE Products SET questionnaireCompleted = true WHERE id = :client_id', {
      replacements: { client_id }
    });

    res.status(201).json(newQuestionnaire);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const getQuestionnaireAnswers = async (req, res) => {
  const { client_id } = req.params;

  try {
    const questionnaire = await sequelize.query('SELECT * FROM Questionnaires WHERE client_id = :client_id', {
      replacements: { client_id },
      type: sequelize.QueryTypes.SELECT
    });

    if (questionnaire.length === 0) {
      return res.status(404).json({ message: 'No questionnaire found for this client' });
    }

    res.status(200).json(questionnaire[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
