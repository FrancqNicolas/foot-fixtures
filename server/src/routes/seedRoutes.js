import express from 'express';
import Match from '../models/Match.js';

const router = express.Router();

router.post('/knockout-matches', async (req, res) => {
  try {
    const knockoutMatches = [
      {
        title: 'Round of 16 - Match 1',
        team1: { name: 'Real Madrid', logoUrl: 'https://upload.wikimedia.org/wikipedia/en/5/56/Real_Madrid_CF.svg', score: 3 },
        team2: { name: 'Liverpool', logoUrl: 'https://upload.wikimedia.org/wikipedia/en/0/0c/Liverpool_FC.svg', score: 1 },
        date: new Date('2025-02-18T21:00:00'),
        status: 'finished',
        stage: 'Round of 16'
      },
      {
        title: 'Round of 16 - Match 2',
        team1: { name: 'Bayern Munich', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/1/1b/FC_Bayern_M%C3%BCnchen_logo_%282017%29.svg', score: 2 },
        team2: { name: 'PSG', logoUrl: 'https://upload.wikimedia.org/wikipedia/en/a/a7/Paris_Saint-Germain_F.C..svg', score: 1 },
        date: new Date('2025-02-18T21:00:00'),
        status: 'finished',
        stage: 'Round of 16'
      },
      {
        title: 'Round of 16 - Match 3',
        team1: { name: 'Man. City', logoUrl: 'https://upload.wikimedia.org/wikipedia/en/e/eb/Manchester_City_FC_badge.svg', score: 2 },
        team2: { name: 'Barcelona', logoUrl: 'https://upload.wikimedia.org/wikipedia/en/4/47/FC_Barcelona_%28crest%29.svg', score: 2 },
        date: new Date('2025-02-19T21:00:00'),
        status: 'finished',
        stage: 'Round of 16'
      },
      {
        title: 'Round of 16 - Match 4',
        team1: { name: 'Arsenal', logoUrl: 'https://upload.wikimedia.org/wikipedia/en/5/53/Arsenal_FC.svg', score: 1 },
        team2: { name: 'Inter', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/0/05/FC_Internazionale_Milano_2021.svg', score: 0 },
        date: new Date('2025-02-19T21:00:00'),
        status: 'finished',
        stage: 'Round of 16'
      },
      {
        title: 'Round of 16 - Match 5',
        team1: { name: 'Atletico Madrid', logoUrl: 'https://upload.wikimedia.org/wikipedia/en/f/f4/Atletico_Madrid_2017_logo.svg', score: null },
        team2: { name: 'BVB Dortmund', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/6/67/Borussia_Dortmund_logo.svg', score: null },
        date: new Date('2025-03-11T21:00:00'),
        status: 'scheduled',
        stage: 'Round of 16'
      },
      {
        title: 'Round of 16 - Match 6',
        team1: { name: 'AC Milan', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/d/d0/Logo_of_AC_Milan.svg', score: null },
        team2: { name: 'RB Leipzig', logoUrl: 'https://upload.wikimedia.org/wikipedia/en/0/04/RB_Leipzig_2014_logo.svg', score: null },
        date: new Date('2025-03-11T21:00:00'),
        status: 'scheduled',
        stage: 'Round of 16'
      },
      {
        title: 'Round of 16 - Match 7',
        team1: { name: 'Benfica', logoUrl: 'https://upload.wikimedia.org/wikipedia/en/a/a2/SL_Benfica_logo.svg', score: null },
        team2: { name: 'Juventus', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/3/31/Juventus_FC_2017_logo.svg', score: null },
        date: new Date('2025-03-12T21:00:00'),
        status: 'scheduled',
        stage: 'Round of 16'
      },
      {
        title: 'Round of 16 - Match 8',
        team1: { name: 'Monaco', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/4/47/Logo_AS_Monaco.svg', score: null },
        team2: { name: 'Sporting CP', logoUrl: 'https://upload.wikimedia.org/wikipedia/en/3/3e/Sporting_Clube_de_Portugal_%28Logo%29.svg', score: null },
        date: new Date('2025-03-12T21:00:00'),
        status: 'scheduled',
        stage: 'Round of 16'
      },
      {
        title: 'Quarter-Final 1',
        team1: { name: 'Real Madrid', logoUrl: 'https://upload.wikimedia.org/wikipedia/en/5/56/Real_Madrid_CF.svg', score: null },
        team2: { name: 'Bayern Munich', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/1/1b/FC_Bayern_M%C3%BCnchen_logo_%282017%29.svg', score: null },
        date: new Date('2025-04-08T21:00:00'),
        status: 'scheduled',
        stage: 'Quarter-Finals'
      },
      {
        title: 'Quarter-Final 2',
        team1: { name: 'Man. City', logoUrl: 'https://upload.wikimedia.org/wikipedia/en/e/eb/Manchester_City_FC_badge.svg', score: null },
        team2: { name: 'Arsenal', logoUrl: 'https://upload.wikimedia.org/wikipedia/en/5/53/Arsenal_FC.svg', score: null },
        date: new Date('2025-04-08T21:00:00'),
        status: 'scheduled',
        stage: 'Quarter-Finals'
      },
      {
        title: 'Quarter-Final 3',
        team1: { name: 'TBD', logoUrl: null, score: null },
        team2: { name: 'TBD', logoUrl: null, score: null },
        date: new Date('2025-04-09T21:00:00'),
        status: 'scheduled',
        stage: 'Quarter-Finals'
      },
      {
        title: 'Quarter-Final 4',
        team1: { name: 'TBD', logoUrl: null, score: null },
        team2: { name: 'TBD', logoUrl: null, score: null },
        date: new Date('2025-04-09T21:00:00'),
        status: 'scheduled',
        stage: 'Quarter-Finals'
      },
      {
        title: 'Semi-Final 1',
        team1: { name: 'TBD', logoUrl: null, score: null },
        team2: { name: 'TBD', logoUrl: null, score: null },
        date: new Date('2025-04-29T21:00:00'),
        status: 'scheduled',
        stage: 'Semi-Finals'
      },
      {
        title: 'Semi-Final 2',
        team1: { name: 'TBD', logoUrl: null, score: null },
        team2: { name: 'TBD', logoUrl: null, score: null },
        date: new Date('2025-04-30T21:00:00'),
        status: 'scheduled',
        stage: 'Semi-Finals'
      },
      {
        title: 'Final',
        team1: { name: 'TBD', logoUrl: null, score: null },
        team2: { name: 'TBD', logoUrl: null, score: null },
        date: new Date('2025-05-31T21:00:00'),
        status: 'scheduled',
        stage: 'Final'
      }
    ];

    await Match.deleteMany({
      stage: { $in: ['Round of 16', 'Quarter-Finals', 'Semi-Finals', 'Final'] }
    });

    const savedMatches = await Match.insertMany(knockoutMatches);

    res.json({
      message: 'Knockout matches seeded successfully',
      count: savedMatches.length,
      matches: savedMatches
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error seeding knockout matches',
      error: error.message
    });
  }
});

export default router;
