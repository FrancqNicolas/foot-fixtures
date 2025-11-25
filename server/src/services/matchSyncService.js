import { matchRepository } from '../repositories/matchRepository.js';
import { getChampionsLeagueMatches, transformMatch } from './footballDataService.js';
import {
  getChampionsLeagueFixtures,
  getFixtureDetails,
  getFixtureEvents,
  getFixtureLineups,
  transformFixture
} from './apiFootballService.js';
import { CACHE_TTL } from '../config/constants.js';
import { AppError } from '../middleware/errorHandler.js';

export const matchSyncService = {
  syncFromFootballData: async (season = null) => {
    const matches = await getChampionsLeagueMatches(season);

    if (matches.length === 0) {
      throw new AppError('No matches found from API', 404);
    }

    await matchRepository.deleteAll();

    const transformedMatches = matches
      .map((match, index) => transformMatch(match, index))
      .filter(match => match.team1?.name && match.team2?.name);

    if (transformedMatches.length === 0) {
      throw new AppError('No valid matches to sync', 400);
    }

    return matchRepository.createMany(transformedMatches);
  },

  syncFromApiFootball: async (season = null) => {
    const fixtures = await getChampionsLeagueFixtures(season);

    if (fixtures.length === 0) {
      throw new AppError('No fixtures found from API', 404);
    }

    await matchRepository.deleteAll();

    const transformedMatches = fixtures
      .map((fixture, index) => transformFixture(fixture, index))
      .filter(match => match.team1?.name && match.team2?.name);

    if (transformedMatches.length === 0) {
      throw new AppError('No valid matches to sync', 400);
    }

    return matchRepository.createMany(transformedMatches);
  },

  syncFixtureDetails: async (fixtureId, forceRefresh = false) => {
    const match = await matchRepository.findByMatchId(fixtureId);

    if (!match) {
      throw new AppError('Match not found in database', 404);
    }

    const isCacheValid = match.details &&
      match.events &&
      match.lineups &&
      match.detailsFetchedAt &&
      (Date.now() - new Date(match.detailsFetchedAt).getTime()) < CACHE_TTL.FIXTURE_DETAILS;

    if (isCacheValid && !forceRefresh) {
      return {
        ...match.details,
        events: match.events,
        lineups: match.lineups
      };
    }

    const [fixture, events, lineups] = await Promise.all([
      getFixtureDetails(fixtureId),
      getFixtureEvents(fixtureId),
      getFixtureLineups(fixtureId)
    ]);

    await matchRepository.updateDetails(fixtureId, fixture, events, lineups);

    return {
      ...fixture,
      events,
      lineups
    };
  }
};
