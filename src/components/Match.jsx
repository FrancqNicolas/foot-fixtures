import Team from './Team';

const Match = ({ title, team1, team2, status, minute, date, onClick }) => {
  const showScore = status === 'finished' || status === 'live';

  const getMatchHeader = () => {
    if (status === 'finished') {
      return 'Terminé';
    }

    if (date) {
      const matchDate = new Date(date);
      const time = matchDate.toLocaleTimeString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit'
      });
      return time;
    }

    return title;
  };

  return (
    <div className="match" onClick={onClick}>
      <div className="match-header">
        {getMatchHeader()}
        {status === 'live' && minute && (
          <span className="live-minute"> - {minute}'</span>
        )}
      </div>
      <div className="match-content">
        <Team
          name={team1.name}
          logoUrl={team1.logoUrl}
          position="left"
          score={showScore ? (team1.score ?? 0) : null}
        />
        {showScore ? (
          <div className="score-separator">
            <span className="score-dash">-</span>
            {status === 'live' && (
              <span className="live-indicator">LIVE</span>
            )}
          </div>
        ) : (
          <div className="vs">VS</div>
        )}
        <Team
          name={team2.name}
          logoUrl={team2.logoUrl}
          position="right"
          score={showScore ? (team2.score ?? 0) : null}
        />
      </div>
    </div>
  );
};

export default Match;
