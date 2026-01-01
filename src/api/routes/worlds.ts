import { Router } from 'express';
import worldController from '../controllers/worldController';
import { authorizeResourceOwnership } from '../middleware/authorization';

const router = Router();

// Get all worlds for the authenticated user
router.get('/', worldController.getWorlds);

// Get a specific world
router.get('/:id', worldController.getWorld);

// Create a new world
router.post('/', worldController.createWorld);

// Update a world (requires ownership)
router.put('/:id', authorizeResourceOwnership('world'), worldController.updateWorld);

// Delete a world (requires ownership)
router.delete('/:id', authorizeResourceOwnership('world'), worldController.deleteWorld);

export default router;