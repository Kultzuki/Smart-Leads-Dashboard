import { Router } from 'express';
import { check } from 'express-validator';
import {
  createLead,
  getLeads,
  getLead,
  updateLead,
  deleteLead,
  exportCSV,
} from '../controllers/leads.controller';
import { protect, restrictTo } from '../middleware/auth.middleware';

const router = Router();

router.use(protect);

router.post(
  '/',
  [
    check('name', 'Name is required').notEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('source', 'Source is required').notEmpty(),
  ],
  createLead
);

router.get('/export', restrictTo('admin'), exportCSV);

router.get('/', getLeads);
router.get('/:id', getLead);

router.put(
  '/:id',
  [
    check('email', 'Please include a valid email').optional().isEmail(),
  ],
  updateLead
);

router.delete('/:id', restrictTo('admin'), deleteLead);

export default router;
