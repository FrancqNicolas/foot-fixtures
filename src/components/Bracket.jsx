import BracketMatch from './BracketMatch';
import { buildBracketTree } from '../utils/bracketUtils';

const Bracket = ({ matches, onMatchClick }) => {
  const stages = buildBracketTree(matches);

  const handleMatchClick = (match) => {
    if (match?.matchId) onMatchClick(match.matchId);
  };

  const renderLeftBranch = (match, children) => (
    <div className="bracket-item bracket-left">
      <div className="bracket-item-parent">
        <BracketMatch match={match} onClick={() => handleMatchClick(match)} />
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
        <BracketMatch match={match} onClick={() => handleMatchClick(match)} />
      </div>
    </div>
  );

  const renderR16Match = (index) => {
    const match = stages['Round of 16'][index];
    return (
      <div className="bracket-item-child">
        <BracketMatch match={match} onClick={() => handleMatchClick(match)} />
      </div>
    );
  };

  return (
    <div className="bracket-wrapper-tree">
      {renderLeftBranch(
        stages['Semi-Finals'][0],
        <>
          <div className="bracket-item-child">
            {renderLeftBranch(
              stages['Quarter-Finals'][0],
              <>
                {renderR16Match(0)}
                {renderR16Match(1)}
              </>
            )}
          </div>
          <div className="bracket-item-child">
            {renderLeftBranch(
              stages['Quarter-Finals'][1],
              <>
                {renderR16Match(2)}
                {renderR16Match(3)}
              </>
            )}
          </div>
        </>
      )}

      <div className="bracket-final">
        <BracketMatch match={stages['Final'][0]} onClick={() => handleMatchClick(stages['Final'][0])} />
      </div>

      {renderRightBranch(
        stages['Semi-Finals'][1],
        <>
          <div className="bracket-item-child">
            {renderRightBranch(
              stages['Quarter-Finals'][2],
              <>
                {renderR16Match(4)}
                {renderR16Match(5)}
              </>
            )}
          </div>
          <div className="bracket-item-child">
            {renderRightBranch(
              stages['Quarter-Finals'][3],
              <>
                {renderR16Match(6)}
                {renderR16Match(7)}
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Bracket;
