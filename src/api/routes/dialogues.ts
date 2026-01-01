import { Router } from 'express';
import dialogueController from '../controllers/dialogueController';
import { authorizeResourceOwnership } from '../middleware/authorization';

const router = Router();

// Get all dialogues for the authenticated user
router.get('/', dialogueController.getDialogues);

// Create a new dialogue
router.post('/', dialogueController.createDialogue);

// TODO: Add other routes (getDialogue, updateDialogue, deleteDialogue)

export default router;