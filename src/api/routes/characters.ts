import { Router } from 'express';
import characterController from '../controllers/characterController';
import { authorizeResourceOwnership } from '../middleware/authorization';

const router = Router();

// Get all characters for the authenticated user
router.get('/', characterController.getCharacters);

// Create a new character
router.post('/', characterController.createCharacter);

// TODO: Add other routes (getCharacter, updateCharacter, deleteCharacter)

export default router;