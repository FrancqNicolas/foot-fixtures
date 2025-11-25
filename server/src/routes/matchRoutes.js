import express from 'express';
import { asyncHandler } from '../middleware/errorHandler.js';
import { validateBody } from '../validators/matchValidator.js';
import { matchSchema, syncMatchesSchema } from '../validators/matchValidator.js';
import {
  getAllMatches,
  getMatchById,
  createMatch,
  updateMatch,
  deleteMatch,
  syncMatches,
  syncMatchesApiFootball,
  getFixtureDetailsController,
  syncFixtureDetails,
  getMatchDetailsLegacy,
  getStandings,
  healthCheck
} from '../controllers/matchController.js';

const router = express.Router();

router.get('/', asyncHandler(getAllMatches));
router.get('/standings', asyncHandler(getStandings));
router.get('/health', healthCheck);
router.get('/fixture-details/:fixtureId', asyncHandler(getFixtureDetailsController));
router.get('/match-details/:matchId', asyncHandler(getMatchDetailsLegacy));
router.get('/:id', asyncHandler(getMatchById));

router.post('/', validateBody(matchSchema), asyncHandler(createMatch));
router.post('/sync', validateBody(syncMatchesSchema), asyncHandler(syncMatches));
router.post('/sync-apifootball', validateBody(syncMatchesSchema), asyncHandler(syncMatchesApiFootball));
router.post('/fixture-details/:fixtureId/sync', asyncHandler(syncFixtureDetails));

router.put('/:id', validateBody(matchSchema), asyncHandler(updateMatch));
router.delete('/:id', asyncHandler(deleteMatch));

export default router;
