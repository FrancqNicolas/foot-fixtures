import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/database.js';
import matchRoutes from './routes/matchRoutes.js';
import seedRoutes from './routes/seedRoutes.js';
import Match from './models/Match.js';
import { getChampionsLeagueMatches, getChampionsLeagueStandings, getMatchDetails, transformMatch } from './services/footballDataService.js';
import {
  getChampionsLeagueFixtures,
  getFixtureDetails,
  getFixtureEvents,
  getFixtureLineups,
  transformFixture
} from './services/apiFootballService.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

// Routes
app.use('/api/matches', matchRoutes);
app.use('/api/seed', seedRoutes);

// Route to sync matches from football-data.org
app.post('/api/sync-matches', async (req, res) => {
  try {
    const { season } = req.body;
    const matches = await getChampionsLeagueMatches(season);

    console.log(`📊 Total matches fetched: ${matches.length}`);

    if (matches.length === 0) {
      return res.status(404).json({
        message: 'No matches found from API'
      });
    }

    // Log first match for debugging
    console.log('First match sample:', JSON.stringify(matches[0], null, 2));

    // Clear existing matches
    await Match.deleteMany({});

    // Transform and filter valid matches
    const transformedMatches = matches
      .map((match, index) => transformMatch(match, index))
      .filter(match => {
        // Only keep matches with valid team names
        const isValid = match.team1?.name && match.team2?.name;
        if (!isValid) {
          console.log('⚠️ Skipping invalid match:', match);
        }
        return isValid;
      });

    console.log(`✅ Valid matches to save: ${transformedMatches.length}`);

    if (transformedMatches.length === 0) {
      return res.status(400).json({
        message: 'No valid matches to sync',
        totalFetched: matches.length
      });
    }

    const savedMatches = await Match.insertMany(transformedMatches);

    res.json({
      message: 'Matches synced successfully',
      count: savedMatches.length,
      matches: savedMatches
    });
  } catch (error) {
    console.error('Error in sync-matches:', error);
    res.status(500).json({
      message: 'Error syncing matches',
      error: error.message,
      details: error.response?.data || null
    });
  }
});

// Get match details by ID (old API)
app.get('/api/match-details/:matchId', async (req, res) => {
  try {
    const { matchId } = req.params;
    const matchDetails = await getMatchDetails(matchId);
    res.json(matchDetails);
  } catch (error) {
    console.error('Error fetching match details:', error);
    res.status(500).json({
      message: 'Error fetching match details',
      error: error.message
    });
  }
});

// Sync matches from API-Football (new API with more details)
app.post('/api/sync-matches-apifootball', async (req, res) => {
  try {
    const { season } = req.body;
    const fixtures = await getChampionsLeagueFixtures(season);

    console.log(`📊 Total fixtures fetched from API-Football: ${fixtures.length}`);

    if (fixtures.length === 0) {
      return res.status(404).json({
        message: 'No fixtures found from API'
      });
    }

    await Match.deleteMany({});

    const transformedMatches = fixtures
      .map((fixture, index) => transformFixture(fixture, index))
      .filter(match => match.team1?.name && match.team2?.name);

    console.log(`✅ Valid matches to save: ${transformedMatches.length}`);

    if (transformedMatches.length === 0) {
      return res.status(400).json({
        message: 'No valid matches to sync',
        totalFetched: fixtures.length
      });
    }

    const savedMatches = await Match.insertMany(transformedMatches);

    res.json({
      message: 'Matches synced successfully from API-Football',
      count: savedMatches.length,
      matches: savedMatches
    });
  } catch (error) {
    console.error('Error in sync-matches-apifootball:', error);
    res.status(500).json({
      message: 'Error syncing matches',
      error: error.message,
      details: error.response?.data || null
    });
  }
});

// Get fixture details with events and lineups
app.get('/api/fixture-details/:fixtureId', async (req, res) => {
  try {
    const { fixtureId } = req.params;

    const [fixture, events, lineups] = await Promise.all([
      getFixtureDetails(fixtureId),
      getFixtureEvents(fixtureId),
      getFixtureLineups(fixtureId)
    ]);

    const fixtureDetails = {
      ...fixture,
      events: events,
      lineups: lineups
    };

    res.json(fixtureDetails);
  } catch (error) {
    console.error('Error fetching fixture details:', error);
    res.status(500).json({
      message: 'Error fetching fixture details',
      error: error.message
    });
  }
});

// Get standings
app.get('/api/standings', async (req, res) => {
  try {
    const { season } = req.query;
    const standings = await getChampionsLeagueStandings(season);
    res.json(standings);
  } catch (error) {
    console.error('Error fetching standings:', error);
    res.status(500).json({
      message: 'Error fetching standings',
      error: error.message
    });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
