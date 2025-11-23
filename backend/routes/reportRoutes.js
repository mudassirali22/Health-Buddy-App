import express from 'express';
import {
  uploadReport,
  getReports,
  getReport,
  deleteReport
} from '../controllers/reportController.js';
import { protect } from '../middleware/auth.js';
import upload from '../middleware/upload.js';

const router = express.Router();

router.route('/')
  .get(protect, getReports)
  .post(protect, upload.single('file'), uploadReport);

router.route('/:id')
  .get(protect, getReport)
  .delete(protect, deleteReport);

export default router;
