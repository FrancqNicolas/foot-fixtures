import { matchRepository } from '../repositories/matchRepository.js';
import { matchSyncService } from '../services/matchSyncService.js';
import { getChampionsLeagueStandings, getMatchDetails } from '../services/footballDataService.js';
import { AppError } from '../middleware/errorHandler.js';

export const getAllMatches = async (req, res) => {
  const matches = await matchRepository.findAll({ createdAt: 1 });
  res.json(matches);
};

export const getMatchById = async (req, res) => {
  const match = await matchRepository.findById(req.params.id);
  if (!match) {
    throw new AppError('Match not found', 404);
  }
  res.json(match);
};

export const createMatch = async (req, res) => {
  const newMatch = await matchRepository.create(req.body);
  res.status(201).json(newMatch);
};

export const updateMatch = async (req, res) => {
  const match = await matchRepository.update(req.params.id, req.body);
  if (!match) {
    throw new AppError('Match not found', 404);
  }
  res.json(match);
};

export const deleteMatch = async (req, res) => {
  const match = await matchRepository.delete(req.params.id);
  if (!match) {
    throw new AppError('Match not found', 404);
  }
  res.json({ message: 'Match deleted successfully' });
};

export const syncMatches = async (req, res) => {
  const { season } = req.body;
  const savedMatches = await matchSyncService.syncFromFootballData(season);
  res.json({
    message: 'Matches synced successfully',
    count: savedMatches.length,
    matches: savedMatches
  });
};

export const syncMatchesApiFootball = async (req, res) => {
  const { season } = req.body;
  const savedMatches = await matchSyncService.syncFromApiFootball(season);
  res.json({
    message: 'Matches synced successfully from API-Football',
    count: savedMatches.length,
    matches: savedMatches
  });
};

export const getFixtureDetailsController = async (req, res) => {
  const { fixtureId } = req.params;
  const details = await matchSyncService.syncFixtureDetails(fixtureId, false);
  res.json(details);
};

export const syncFixtureDetails = async (req, res) => {
  const { fixtureId } = req.params;
  const details = await matchSyncService.syncFixtureDetails(fixtureId, true);
  res.json({
    message: 'Fixture details synced successfully',
    details
  });
};

export const getMatchDetailsLegacy = async (req, res) => {
  const { matchId } = req.params;
  const matchDetails = await getMatchDetails(matchId);
  res.json(matchDetails);
};

export const getStandings = async (req, res) => {
  const { season } = req.query;
  const standings = await getChampionsLeagueStandings(season);
  res.json(standings);
};

export const healthCheck = (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
};
