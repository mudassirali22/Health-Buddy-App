import express from 'express';
const router = express.Router();
import {
  addReminder,
  getReminders,
  updateReminder,
  deleteReminder
} from '../controllers/reminderController.js';
import { protect } from '../middleware/auth.js';

router.use(protect); // All reminder routes are protected

router.route('/')
  .post(addReminder)
  .get(getReminders);

router.route('/:id')
  .put(updateReminder)
  .delete(deleteReminder);

export default router;
