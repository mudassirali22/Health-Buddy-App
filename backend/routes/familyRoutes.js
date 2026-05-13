import express from 'express';
const router = express.Router();
import {
  addFamilyMember,
  getFamilyMembers,
  updateFamilyMember,
  deleteFamilyMember,
  sendCredentials
} from '../controllers/familyController.js';
import { protect } from '../middleware/auth.js';

// All routes are protected
router.use(protect);

router.post('/', addFamilyMember);
router.get('/', getFamilyMembers);
router.put('/:id', updateFamilyMember);
router.delete('/:id', deleteFamilyMember);
router.post('/:id/send-credentials', sendCredentials);

export default router;
