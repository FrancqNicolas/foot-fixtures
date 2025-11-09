import express from 'express';
import {
  getAllMatches,
  getMatchById,
  createMatch,
  updateMatch,
  deleteMatch
} from '../controllers/matchController.js';

const router = express.Router();

// GET all matches
router.get('/', getAllMatches);

// GET single match
router.get('/:id', getMatchById);

// POST new match
router.post('/', createMatch);

// PUT update match
router.put('/:id', updateMatch);

// DELETE match
router.delete('/:id', deleteMatch);

export default router;
