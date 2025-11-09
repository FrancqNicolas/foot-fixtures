import { useStandings } from '../hooks/useStandings';

export default function Standings({ season }) {
  const { standings, loading, error } = useStandings(season);

  if (loading) {
    return (
      <div className="standings-container">
        <div className="loading">Chargement du classement...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="standings-container">
        <div className="error">Erreur: {error}</div>
      </div>
    );
  }

  if (!standings || !standings.standings || standings.standings.length === 0) {
    return (
      <div className="standings-container">
        <div className="no-data">Aucun classement disponible</div>
      </div>
    );
  }

  // Get the league phase standings (TOTAL type)
  const leagueStandings = standings.standings.find(
    s => s.type === 'TOTAL' && (s.stage === 'LEAGUE_STAGE' || s.stage === 'GROUP_STAGE')
  );

  if (!leagueStandings || !leagueStandings.table) {
    return (
      <div className="standings-container">
        <div className="no-data">Aucun classement de phase de ligue disponible</div>
      </div>
    );
  }

  return (
    <div className="standings-container">
      <h2 className="standings-title">Classement de la Phase de Ligue</h2>

      <div className="standings-table-wrapper">
        <table className="standings-table">
          <thead>
            <tr>
              <th className="pos-col">#</th>
              <th className="team-col">Équipe</th>
              <th className="stat-col">J</th>
              <th className="stat-col">V</th>
              <th className="stat-col">N</th>
              <th className="stat-col">D</th>
              <th className="stat-col">BP</th>
              <th className="stat-col">BC</th>
              <th className="stat-col">Diff</th>
              <th className="pts-col">Pts</th>
            </tr>
          </thead>
          <tbody>
            {leagueStandings.table.map((entry) => {
              // Determine qualification status based on position
              let qualificationClass = '';
              if (entry.position <= 8) {
                qualificationClass = 'qualification-direct';
              } else if (entry.position <= 24) {
                qualificationClass = 'qualification-playoff';
              } else {
                qualificationClass = 'elimination';
              }

              return (
                <tr key={entry.team.id} className={qualificationClass}>
                  <td className="pos-col">{entry.position}</td>
                  <td className="team-col">
                    <div className="team-info">
                      {entry.team.crest && (
                        <img
                          src={entry.team.crest}
                          alt={entry.team.name}
                          className="team-logo-small"
                        />
                      )}
                      <span className="team-name">{entry.team.shortName || entry.team.name}</span>
                    </div>
                  </td>
                  <td className="stat-col">{entry.playedGames}</td>
                  <td className="stat-col">{entry.won}</td>
                  <td className="stat-col">{entry.draw}</td>
                  <td className="stat-col">{entry.lost}</td>
                  <td className="stat-col">{entry.goalsFor}</td>
                  <td className="stat-col">{entry.goalsAgainst}</td>
                  <td className="stat-col">
                    <span className={entry.goalDifference > 0 ? 'positive' : entry.goalDifference < 0 ? 'negative' : ''}>
                      {entry.goalDifference > 0 ? '+' : ''}{entry.goalDifference}
                    </span>
                  </td>
                  <td className="pts-col"><strong>{entry.points}</strong></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="standings-legend">
        <div className="legend-item">
          <span className="legend-color qualification-direct"></span>
          <span>Qualification directe 1/8e de finale (1-8)</span>
        </div>
        <div className="legend-item">
          <span className="legend-color qualification-playoff"></span>
          <span>Barrages (9-24)</span>
        </div>
        <div className="legend-item">
          <span className="legend-color elimination"></span>
          <span>Élimination (25-36)</span>
        </div>
      </div>
    </div>
  );
}
