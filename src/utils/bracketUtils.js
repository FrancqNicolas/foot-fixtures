import { STAGES, STAGE_COUNTS } from '../config/api.js';

export const createPlaceholderMatch = (stage, index) => ({
  _id: `placeholder-${stage}-${index}`,
  title: `${stage} - Match ${index + 1}`,
  team1: { name: 'TBD', logoUrl: null, score: null },
  team2: { name: 'TBD', logoUrl: null, score: null },
  status: 'scheduled',
  stage
});

const getWinner = (match) => {
  if (match.status !== 'finished') return null;
  if (match.team1.score > match.team2.score) return match.team1.name;
  if (match.team2.score > match.team1.score) return match.team2.name;
  return null;
};

const groupMatchesByStage = (matches) => {
  const grouped = {};
  STAGES.forEach(stage => grouped[stage] = []);

  matches.forEach(match => {
    if (grouped[match.stage]) {
      grouped[match.stage].push(match);
    }
  });

  return grouped;
};

const findPreviousMatches = (team1, team2, previousStageMatches) => {
  const team1Match = previousStageMatches.find(m =>
    getWinner(m) === team1 || m.team1.name === team1 || m.team2.name === team1
  );
  const team2Match = previousStageMatches.find(m =>
    getWinner(m) === team2 || m.team1.name === team2 || m.team2.name === team2
  );
  return [team1Match, team2Match].filter(Boolean);
};

const fillPlaceholders = (arr, stage) => {
  const targetCount = STAGE_COUNTS[stage];
  while (arr.length < targetCount) {
    arr.push(createPlaceholderMatch(stage, arr.length));
  }
  return arr;
};

export const buildBracketTree = (matches) => {
  const stageMatches = groupMatchesByStage(matches);
  const finals = stageMatches['Final'];
  const semis = stageMatches['Semi-Finals'];

  if (finals.length === 0) {
    return {
      'Round of 16': fillPlaceholders([], 'Round of 16'),
      'Quarter-Finals': fillPlaceholders([], 'Quarter-Finals'),
      'Semi-Finals': fillPlaceholders([], 'Semi-Finals'),
      'Final': [createPlaceholderMatch('Final', 0)]
    };
  }

  const tree = {
    final: finals[0] || createPlaceholderMatch('Final', 0),
    semis: [],
    quarters: [],
    r16: []
  };

  if (semis.length >= 2) {
    tree.semis = semis;

    semis.forEach((semi, semiIdx) => {
      const quarterPair = findPreviousMatches(
        semi.team1.name,
        semi.team2.name,
        stageMatches['Quarter-Finals']
      );

      tree.quarters[semiIdx * 2] = quarterPair[0] || createPlaceholderMatch('Quarter-Finals', semiIdx * 2);
      tree.quarters[semiIdx * 2 + 1] = quarterPair[1] || createPlaceholderMatch('Quarter-Finals', semiIdx * 2 + 1);

      quarterPair.forEach((quarter, qIdx) => {
        if (quarter) {
          const r16Pair = findPreviousMatches(
            quarter.team1.name,
            quarter.team2.name,
            stageMatches['Round of 16']
          );
          const baseIdx = (semiIdx * 2 + qIdx) * 2;
          tree.r16[baseIdx] = r16Pair[0] || createPlaceholderMatch('Round of 16', baseIdx);
          tree.r16[baseIdx + 1] = r16Pair[1] || createPlaceholderMatch('Round of 16', baseIdx + 1);
        }
      });
    });
  }

  return {
    'Round of 16': fillPlaceholders(tree.r16, 'Round of 16'),
    'Quarter-Finals': fillPlaceholders(tree.quarters, 'Quarter-Finals'),
    'Semi-Finals': fillPlaceholders(tree.semis, 'Semi-Finals'),
    'Final': [tree.final]
  };
};
