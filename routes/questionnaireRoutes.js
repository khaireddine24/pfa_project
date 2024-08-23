// routes/questionnaireRoutes.js
import express from 'express';
import { submitQuestionnaire, getQuestionnaireAnswers } from '../controllers/questionnaireController.js';
import upload from '../config/multerConfig.js';
import sequelize from '../config/database.js'; // Adjust the path accordingly
import Questionnaire from '../models/Questionnaire.js';

const router = express.Router();

// Route for submitting questionnaire with image uploads
router.post('/submit-questionnaire', 
  upload.fields([
    { name: 'image0', maxCount: 1 },
    { name: 'image1', maxCount: 1 },
    { name: 'image2', maxCount: 1 },
    { name: 'image3', maxCount: 1 },
    { name: 'image4', maxCount: 1 },
    { name: 'image5', maxCount: 1 },
    { name: 'image6', maxCount: 1 },
    { name: 'image7', maxCount: 1 },
    { name: 'image8', maxCount: 1 },
    { name: 'image9', maxCount: 1 },
    { name: 'image10', maxCount: 1 },
    { name: 'image11', maxCount: 1 },
    { name: 'image12', maxCount: 1 },
    { name: 'image13', maxCount: 1 },
    { name: 'image14', maxCount: 1 },
    { name: 'image15', maxCount: 1 },
    { name: 'image16', maxCount: 1 },
    { name: 'image17', maxCount: 1 },
    { name: 'image18', maxCount: 1 },
    { name: 'image19', maxCount: 1 }

  ]), 
  submitQuestionnaire
);

// Route for retrieving questionnaire answers
router.get('/questionnaire-answers/:client_id', getQuestionnaireAnswers);
// Route to update a questionnaire
router.put('/updateQuestionnaire/:id', async (req, res) => {
  const { id } = req.params;
  const { questions, optionsSelected } = req.body;

  console.log('Request Body:', req.body); // Log the entire request body for debugging

  try {
    // Ensure the data is properly formatted
    const questionsData = JSON.stringify(questions);
    const optionsData = JSON.stringify(optionsSelected);

    console.log('Updating questionnaire with ID:', id);
    console.log('Questions Data:', questionsData);
    console.log('Options Data:', optionsData);

    // Find the questionnaire
    const questionnaire = await Questionnaire.findByPk(id);

    if (!questionnaire) {
      return res.status(404).json({ message: 'Questionnaire not found' });
    }

    // Update the questionnaire
    questionnaire.questions = questionsData;
    questionnaire.optionsSelected = optionsData;
    await questionnaire.save();

    res.status(200).json({ message: 'Questionnaire updated successfully' });
  } catch (error) {
    console.error('Error updating questionnaire:', error);
    res.status(500).json({ error: error.message });
  }
});
// Delete questionnaire route
router.delete('/deleteQuestionnaire/:client_id', async (req, res) => {
  const { client_id } = req.params;

  try {
    // Log the client_id for debugging
    console.log('Attempting to delete questionnaire for client ID:', client_id);

    // Perform the delete operation
    const result = await Questionnaire.destroy({
      where: { client_id: client_id }
    });

    // Check if any row was deleted
    if (result === 0) {
      return res.status(404).json({ message: 'Questionnaire not found for the provided client ID' });
    }

    // Return success message
    res.status(200).json({ message: 'Questionnaire deleted successfully' });
  } catch (error) {
    console.error('Error deleting questionnaire:', error.message);
    res.status(500).json({ error: error.message });
  }
});

export default router;
