const BracketMatch = ({ match, onClick }) => {
  const showScore = match.status === 'finished' || match.status === 'live';

  return (
    <div className="bracket-match" onClick={onClick}>
      <div className="bracket-team">
        <div className="bracket-team-logo">
          {match.team1.logoUrl && <img src={match.team1.logoUrl} alt={match.team1.name} />}
        </div>
        <div className="bracket-team-name">{match.team1.name}</div>
        {showScore && <div className="bracket-team-score">{match.team1.score ?? 0}</div>}
      </div>
      <div className="bracket-team">
        <div className="bracket-team-logo">
          {match.team2.logoUrl && <img src={match.team2.logoUrl} alt={match.team2.name} />}
        </div>
        <div className="bracket-team-name">{match.team2.name}</div>
        {showScore && <div className="bracket-team-score">{match.team2.score ?? 0}</div>}
      </div>
    </div>
  );
};

export default BracketMatch;
