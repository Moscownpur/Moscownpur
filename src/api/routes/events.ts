import { Router } from 'express';
import eventController from '../controllers/eventController';
import { authorizeResourceOwnership } from '../middleware/authorization';

const router = Router();

// Get all events for the authenticated user
router.get('/', eventController.getEvents);

// Create a new event
router.post('/', eventController.createEvent);

// TODO: Add other routes (getEvent, updateEvent, deleteEvent)

export default router;