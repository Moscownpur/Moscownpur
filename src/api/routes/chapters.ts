import { Router } from 'express';
import chapterController from '../controllers/chapterController';
import { authorizeResourceOwnership } from '../middleware/authorization';

const router = Router();

// Get all chapters for the authenticated user
router.get('/', chapterController.getChapters);

// Get a specific chapter
router.get('/:id', chapterController.getChapter);

// Create a new chapter
router.post('/', chapterController.createChapter);

// Update a chapter (requires ownership)
router.put('/:id', authorizeResourceOwnership('chapter'), chapterController.updateChapter);

// Delete a chapter (requires ownership)
router.delete('/:id', authorizeResourceOwnership('chapter'), chapterController.deleteChapter);

export default router;