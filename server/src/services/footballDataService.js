import axios from 'axios';
import dotenv from 'dotenv';
import { UCL_COMPETITION_ID, STAGE_MAP, MATCH_STATUS } from '../config/constants.js';

dotenv.config();

const FOOTBALL_DATA_API = 'https://api.football-data.org/v4';
const API_KEY = process.env.FOOTBALL_DATA_API_KEY;

const apiClient = axios.create({
  baseURL: FOOTBALL_DATA_API,
  headers: { 'X-Auth-Token': API_KEY }
});

export const getChampionsLeagueMatches = async (season = null) => {
  const url = season
    ? `/competitions/${UCL_COMPETITION_ID}/matches?season=${season}`
    : `/competitions/${UCL_COMPETITION_ID}/matches`;

  const response = await apiClient.get(url);
  return response.data.matches;
};

export const getChampionsLeagueStandings = async (season = null) => {
  const url = season
    ? `/competitions/${UCL_COMPETITION_ID}/standings?season=${season}`
    : `/competitions/${UCL_COMPETITION_ID}/standings`;

  const response = await apiClient.get(url);
  return response.data;
};

export const getMatchDetails = async (matchId) => {
  const response = await apiClient.get(`/matches/${matchId}`);
  return response.data;
};

const getStatus = (apiStatus) => {
  if (apiStatus === 'FINISHED') return MATCH_STATUS.FINISHED;
  if (apiStatus === 'IN_PLAY') return MATCH_STATUS.LIVE;
  return MATCH_STATUS.SCHEDULED;
};

export const transformMatch = (match, index) => {
  const stage = STAGE_MAP[match.stage] || match.stage;
  const status = getStatus(match.status);

  const getScore = (team) => {
    if (status === MATCH_STATUS.LIVE) {
      return match.score?.regularTime?.[team] ?? match.score?.fullTime?.[team] ?? null;
    }
    return match.score?.fullTime?.[team] ?? null;
  };

  return {
    matchId: match.id,
    title: `${stage} - Match ${index + 1}`,
    team1: {
      name: match.homeTeam.shortName || match.homeTeam.name,
      logoUrl: match.homeTeam.crest || null,
      score: getScore('home')
    },
    team2: {
      name: match.awayTeam.shortName || match.awayTeam.name,
      logoUrl: match.awayTeam.crest || null,
      score: getScore('away')
    },
    date: match.utcDate,
    status,
    minute: match.minute || null,
    competition: 'UEFA Champions League',
    stage
  };
};
