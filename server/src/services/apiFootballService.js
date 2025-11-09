import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const API_FOOTBALL_BASE_URL = 'https://api-football-v1.p.rapidapi.com/v3';
const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY;
const RAPIDAPI_HOST = 'api-football-v1.p.rapidapi.com';

const UCL_LEAGUE_ID = 2;

const apiFootballClient = axios.create({
  baseURL: API_FOOTBALL_BASE_URL,
  headers: {
    'X-RapidAPI-Key': RAPIDAPI_KEY,
    'X-RapidAPI-Host': RAPIDAPI_HOST
  }
});

export const getChampionsLeagueFixtures = async (season = null) => {
  try {
    const currentYear = new Date().getFullYear();
    const selectedSeason = season || currentYear;

    const response = await apiFootballClient.get('/fixtures', {
      params: {
        league: UCL_LEAGUE_ID,
        season: selectedSeason
      }
    });

    console.log(`✅ Fetched ${response.data.response.length} fixtures from API-Football${season ? ` (season ${season})` : ''}`);
    return response.data.response;
  } catch (error) {
    console.error('Error fetching Champions League fixtures:', error.response?.data || error.message);
    throw error;
  }
};

export const getFixtureDetails = async (fixtureId) => {
  try {
    const response = await apiFootballClient.get('/fixtures', {
      params: {
        id: fixtureId
      }
    });

    if (response.data.response.length === 0) {
      throw new Error('Fixture not found');
    }

    console.log(`✅ Fetched details for fixture ${fixtureId}`);
    return response.data.response[0];
  } catch (error) {
    console.error('Error fetching fixture details:', error.response?.data || error.message);
    throw error;
  }
};

export const getFixtureEvents = async (fixtureId) => {
  try {
    const response = await apiFootballClient.get('/fixtures/events', {
      params: {
        fixture: fixtureId
      }
    });

    console.log(`✅ Fetched ${response.data.response.length} events for fixture ${fixtureId}`);
    return response.data.response;
  } catch (error) {
    console.error('Error fetching fixture events:', error.response?.data || error.message);
    throw error;
  }
};

export const getFixtureLineups = async (fixtureId) => {
  try {
    const response = await apiFootballClient.get('/fixtures/lineups', {
      params: {
        fixture: fixtureId
      }
    });

    console.log(`✅ Fetched lineups for fixture ${fixtureId}`);
    return response.data.response;
  } catch (error) {
    console.error('Error fetching fixture lineups:', error.response?.data || error.message);
    throw error;
  }
};

export const transformFixture = (fixture, index) => {
  const formatStage = (round) => {
    if (!round) return 'Unknown';

    if (round.includes('Final')) return 'Final';
    if (round.includes('Semi')) return 'Semi-Finals';
    if (round.includes('Quarter')) return 'Quarter-Finals';
    if (round.includes('8th Finals') || round.includes('Round of 16')) return 'Round of 16';
    if (round.includes('Group') || round.includes('League')) return 'League Phase';

    return round;
  };

  const getStatus = (fixtureStatus) => {
    const statusMap = {
      'MATCH_FINISHED': 'finished',
      'FT': 'finished',
      'AET': 'finished',
      'PEN': 'finished',
      'LIVE': 'live',
      '1H': 'live',
      '2H': 'live',
      'HT': 'live',
      'ET': 'live',
      'P': 'live',
      'NS': 'scheduled',
      'TBD': 'scheduled',
      'PST': 'scheduled',
      'CANC': 'scheduled',
      'ABD': 'scheduled'
    };

    return statusMap[fixtureStatus.short] || 'scheduled';
  };

  const status = getStatus(fixture.fixture.status);

  return {
    matchId: fixture.fixture.id,
    title: `${formatStage(fixture.league.round)} - Match ${index + 1}`,
    team1: {
      name: fixture.teams.home.name,
      logoUrl: fixture.teams.home.logo || null,
      score: status === 'live' || status === 'finished' ? (fixture.goals.home ?? 0) : null
    },
    team2: {
      name: fixture.teams.away.name,
      logoUrl: fixture.teams.away.logo || null,
      score: status === 'live' || status === 'finished' ? (fixture.goals.away ?? 0) : null
    },
    date: fixture.fixture.date,
    status: status,
    minute: fixture.fixture.status.elapsed || null,
    competition: 'UEFA Champions League',
    stage: formatStage(fixture.league.round)
  };
};
