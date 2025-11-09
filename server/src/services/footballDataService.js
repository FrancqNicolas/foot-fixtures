import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const FOOTBALL_DATA_API = 'https://api.football-data.org/v4';
const API_KEY = process.env.FOOTBALL_DATA_API_KEY;

// UEFA Champions League competition ID
const UCL_COMPETITION_ID = 2001;

// Get Champions League matches (all stages, all statuses)
export const getChampionsLeagueMatches = async (season = null) => {
  try {
    const url = season
      ? `${FOOTBALL_DATA_API}/competitions/${UCL_COMPETITION_ID}/matches?season=${season}`
      : `${FOOTBALL_DATA_API}/competitions/${UCL_COMPETITION_ID}/matches`;

    const response = await axios.get(url, {
      headers: {
        'X-Auth-Token': API_KEY
      }
    });

    console.log(`✅ Fetched ${response.data.matches.length} matches from API${season ? ` (season ${season})` : ''}`);
    return response.data.matches;
  } catch (error) {
    console.error('Error fetching Champions League matches:', error.response?.data || error.message);
    throw error;
  }
};

// Get Champions League standings
export const getChampionsLeagueStandings = async (season = null) => {
  try {
    const url = season
      ? `${FOOTBALL_DATA_API}/competitions/${UCL_COMPETITION_ID}/standings?season=${season}`
      : `${FOOTBALL_DATA_API}/competitions/${UCL_COMPETITION_ID}/standings`;

    const response = await axios.get(url, {
      headers: {
        'X-Auth-Token': API_KEY
      }
    });

    console.log(`✅ Fetched standings from API${season ? ` (season ${season})` : ''}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching Champions League standings:', error.response?.data || error.message);
    throw error;
  }
};

// Get detailed match information by ID
export const getMatchDetails = async (matchId) => {
  try {
    const response = await axios.get(
      `${FOOTBALL_DATA_API}/matches/${matchId}`,
      {
        headers: {
          'X-Auth-Token': API_KEY
        }
      }
    );

    console.log(`✅ Fetched details for match ${matchId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching match details:', error.response?.data || error.message);
    throw error;
  }
};

// Transform football-data.org match to our format
export const transformMatch = (match, index) => {
  const formatStage = (stage) => {
    const stageMap = {
      'FINAL': 'Final',
      'SEMI_FINALS': 'Semi-Finals',
      'QUARTER_FINALS': 'Quarter-Finals',
      'ROUND_OF_16': 'Round of 16',
      'LAST_16': 'Round of 16',
      'GROUP_STAGE': 'Group Stage',
      'LEAGUE_STAGE': 'League Phase',
      'PRELIMINARY_ROUND': 'Preliminary Round'
    };
    return stageMap[stage] || stage;
  };

  const status = match.status === 'FINISHED' ? 'finished' : match.status === 'IN_PLAY' ? 'live' : 'scheduled';

  return {
    matchId: match.id,
    title: `${formatStage(match.stage)} - Match ${index + 1}`,
    team1: {
      name: match.homeTeam.shortName || match.homeTeam.name,
      logoUrl: match.homeTeam.crest || null,
      score: status === 'live' ? (match.score?.regularTime?.home ?? match.score?.fullTime?.home ?? null) : (match.score?.fullTime?.home ?? null)
    },
    team2: {
      name: match.awayTeam.shortName || match.awayTeam.name,
      logoUrl: match.awayTeam.crest || null,
      score: status === 'live' ? (match.score?.regularTime?.away ?? match.score?.fullTime?.away ?? null) : (match.score?.fullTime?.away ?? null)
    },
    date: match.utcDate,
    status: status,
    minute: match.minute || null,
    competition: 'UEFA Champions League',
    stage: formatStage(match.stage)
  };
};
