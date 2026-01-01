import { Router } from 'express';
import sceneController from '../controllers/sceneController';
import { authorizeResourceOwnership } from '../middleware/authorization';

const router = Router();

// Get all scenes for the authenticated user
router.get('/', sceneController.getScenes);

// Create a new scene
router.post('/', sceneController.createScene);

// TODO: Add other routes (getScene, updateScene, deleteScene)

export default router;