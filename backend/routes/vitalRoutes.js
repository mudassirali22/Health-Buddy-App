import express from 'express';
import {
  addVital,
  getVitals,
  getVital,
  updateVital,
  deleteVital
} from '../controllers/vitalController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.route('/')
  .get(protect, getVitals)
  .post(protect, addVital);

router.route('/:id')
  .get(protect, getVital)
  .put(protect, updateVital)
  .delete(protect, deleteVital);

export default router;