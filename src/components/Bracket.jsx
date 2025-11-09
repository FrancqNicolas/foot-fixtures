import BracketMatch from './BracketMatch';

const Bracket = ({ matches, onMatchClick }) => {
  const createPlaceholderMatch = (stage, index) => ({
    _id: `placeholder-${stage}-${index}`,
    title: `${stage} - Match ${index + 1}`,
    team1: { name: 'TBD', logoUrl: null, score: null },
    team2: { name: 'TBD', logoUrl: null, score: null },
    status: 'scheduled',
    stage: stage
  });

  const buildBracketTree = () => {
    const stageMatches = {
      'Round of 16': [],
      'Quarter-Finals': [],
      'Semi-Finals': [],
      'Final': []
    };

    matches.forEach(match => {
      if (stageMatches[match.stage]) {
        stageMatches[match.stage].push(match);
      }
    });

    const getWinner = (match) => {
      if (match.status !== 'finished') return null;
      if (match.team1.score > match.team2.score) return match.team1.name;
      if (match.team2.score > match.team1.score) return match.team2.name;
      return null;
    };

    const findPreviousMatches = (team1, team2, previousStage) => {
      const prevMatches = stageMatches[previousStage];
      const team1Match = prevMatches.find(m =>
        getWinner(m) === team1 || m.team1.name === team1 || m.team2.name === team1
      );
      const team2Match = prevMatches.find(m =>
        getWinner(m) === team2 || m.team1.name === team2 || m.team2.name === team2
      );
      return [team1Match, team2Match].filter(Boolean);
    };

    const buildTree = () => {
      const finals = stageMatches['Final'];
      const semis = stageMatches['Semi-Finals'];

      if (finals.length === 0) {
        return {
          'Round of 16': Array(8).fill(null).map((_, i) => createPlaceholderMatch('Round of 16', i)),
          'Quarter-Finals': Array(4).fill(null).map((_, i) => createPlaceholderMatch('Quarter-Finals', i)),
          'Semi-Finals': Array(2).fill(null).map((_, i) => createPlaceholderMatch('Semi-Finals', i)),
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
          const quarterPair = findPreviousMatches(semi.team1.name, semi.team2.name, 'Quarter-Finals');
          tree.quarters[semiIdx * 2] = quarterPair[0] || createPlaceholderMatch('Quarter-Finals', semiIdx * 2);
          tree.quarters[semiIdx * 2 + 1] = quarterPair[1] || createPlaceholderMatch('Quarter-Finals', semiIdx * 2 + 1);

          quarterPair.forEach((quarter, qIdx) => {
            if (quarter) {
              const r16Pair = findPreviousMatches(quarter.team1.name, quarter.team2.name, 'Round of 16');
              const baseIdx = (semiIdx * 2 + qIdx) * 2;
              tree.r16[baseIdx] = r16Pair[0] || createPlaceholderMatch('Round of 16', baseIdx);
              tree.r16[baseIdx + 1] = r16Pair[1] || createPlaceholderMatch('Round of 16', baseIdx + 1);
            }
          });
        });
      }

      while (tree.r16.length < 8) {
        tree.r16.push(createPlaceholderMatch('Round of 16', tree.r16.length));
      }
      while (tree.quarters.length < 4) {
        tree.quarters.push(createPlaceholderMatch('Quarter-Finals', tree.quarters.length));
      }
      while (tree.semis.length < 2) {
        tree.semis.push(createPlaceholderMatch('Semi-Finals', tree.semis.length));
      }

      return {
        'Round of 16': tree.r16,
        'Quarter-Finals': tree.quarters,
        'Semi-Finals': tree.semis,
        'Final': [tree.final]
      };
    };

    return buildTree();
  };

  const stages = buildBracketTree();

  const renderLeftBranch = (match, children) => (
    <div className="bracket-item bracket-left">
      <div className="bracket-item-parent">
        <BracketMatch match={match} onClick={() => match.matchId && onMatchClick(match.matchId)} />
      </div>
      {children && (
        <div className="bracket-item-childrens">
          {children}
        </div>
      )}
    </div>
  );

  const renderRightBranch = (match, children) => (
    <div className="bracket-item bracket-right">
      {children && (
        <div className="bracket-item-childrens">
          {children}
        </div>
      )}
      <div className="bracket-item-parent">
        <BracketMatch match={match} onClick={() => match.matchId && onMatchClick(match.matchId)} />
      </div>
    </div>
  );

  return (
    <div className="bracket-wrapper-tree">
      {renderLeftBranch(
        stages['Semi-Finals'][0],
        <>
          <div className="bracket-item-child">
            {renderLeftBranch(
              stages['Quarter-Finals'][0],
              <>
                <div className="bracket-item-child">
                  <BracketMatch match={stages['Round of 16'][0]} onClick={() => stages['Round of 16'][0]?.matchId && onMatchClick(stages['Round of 16'][0].matchId)} />
                </div>
                <div className="bracket-item-child">
                  <BracketMatch match={stages['Round of 16'][1]} onClick={() => stages['Round of 16'][1]?.matchId && onMatchClick(stages['Round of 16'][1].matchId)} />
                </div>
              </>
            )}
          </div>
          <div className="bracket-item-child">
            {renderLeftBranch(
              stages['Quarter-Finals'][1],
              <>
                <div className="bracket-item-child">
                  <BracketMatch match={stages['Round of 16'][2]} onClick={() => stages['Round of 16'][2]?.matchId && onMatchClick(stages['Round of 16'][2].matchId)} />
                </div>
                <div className="bracket-item-child">
                  <BracketMatch match={stages['Round of 16'][3]} onClick={() => stages['Round of 16'][3]?.matchId && onMatchClick(stages['Round of 16'][3].matchId)} />
                </div>
              </>
            )}
          </div>
        </>
      )}

      <div className="bracket-final">
        <BracketMatch match={stages['Final'][0]} onClick={() => stages['Final'][0]?.matchId && onMatchClick(stages['Final'][0].matchId)} />
      </div>

      {renderRightBranch(
        stages['Semi-Finals'][1],
        <>
          <div className="bracket-item-child">
            {renderRightBranch(
              stages['Quarter-Finals'][2],
              <>
                <div className="bracket-item-child">
                  <BracketMatch match={stages['Round of 16'][4]} onClick={() => stages['Round of 16'][4]?.matchId && onMatchClick(stages['Round of 16'][4].matchId)} />
                </div>
                <div className="bracket-item-child">
                  <BracketMatch match={stages['Round of 16'][5]} onClick={() => stages['Round of 16'][5]?.matchId && onMatchClick(stages['Round of 16'][5].matchId)} />
                </div>
              </>
            )}
          </div>
          <div className="bracket-item-child">
            {renderRightBranch(
              stages['Quarter-Finals'][3],
              <>
                <div className="bracket-item-child">
                  <BracketMatch match={stages['Round of 16'][6]} onClick={() => stages['Round of 16'][6]?.matchId && onMatchClick(stages['Round of 16'][6].matchId)} />
                </div>
                <div className="bracket-item-child">
                  <BracketMatch match={stages['Round of 16'][7]} onClick={() => stages['Round of 16'][7]?.matchId && onMatchClick(stages['Round of 16'][7].matchId)} />
                </div>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Bracket;
