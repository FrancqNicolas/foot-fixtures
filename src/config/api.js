export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const SYNC_INTERVAL = 60000;

export const STAGES = ['Round of 16', 'Quarter-Finals', 'Semi-Finals', 'Final'];

export const STAGE_COUNTS = {
  'Round of 16': 8,
  'Quarter-Finals': 4,
  'Semi-Finals': 2,
  'Final': 1
};

export const PHASE_FILTERS = {
  LEAGUE: ['Group Stage', 'League Phase'],
  KNOCKOUT: ['Round of 16', 'Quarter-Finals', 'Semi-Finals', 'Final']
};
