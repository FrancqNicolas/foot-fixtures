const Team = ({ name, logoUrl, position, score }) => {
  const hasScore = score !== null && score !== undefined;

  return (
    <div className={`team ${position}`}>
      {position === 'left' && (
        <>
          <div className="team-logo">
            {logoUrl && <img src={logoUrl} alt={name} />}
          </div>
          <div className="team-info">
            <div className="team-name">{name}</div>
            {hasScore && (
              <div className="team-score">{score}</div>
            )}
          </div>
        </>
      )}
      {position === 'right' && (
        <>
          <div className="team-info">
            <div className="team-name">{name}</div>
            {hasScore && (
              <div className="team-score">{score}</div>
            )}
          </div>
          <div className="team-logo">
            {logoUrl && <img src={logoUrl} alt={name} />}
          </div>
        </>
      )}
    </div>
  );
};

export default Team;
