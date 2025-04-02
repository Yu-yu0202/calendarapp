import express from 'express';
import eventController from '../controllers/eventController';
import { authMiddleware } from '../middlewares/auth';

const router = express.Router();

router.use(authMiddleware); // 認証ミドルウェアを適用

router.post('/', eventController.createEvent);
router.get('/', eventController.getAllEvents);
router.get('/range', eventController.getEventsByDateRange);
router.get('/:id', eventController.getEvent);
router.put('/:id', eventController.updateEvent);
router.delete('/:id', eventController.deleteEvent);

export default router;