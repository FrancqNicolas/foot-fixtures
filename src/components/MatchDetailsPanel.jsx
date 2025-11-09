import { useState, useEffect } from 'react';

const API_URL = 'http://localhost:5000/api';

const MatchDetailsPanel = ({ matchId, onClose }) => {
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/fixture-details/${matchId}`);
        if (!response.ok) throw new Error('Failed to fetch match details');
        const data = await response.json();
        setDetails(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (matchId) {
      fetchDetails();
    }
  }, [matchId]);

  if (!matchId) return null;

  return (
    <div className="match-details-overlay" onClick={onClose}>
      <div className="match-details-panel" onClick={(e) => e.stopPropagation()}>
        {loading && <div className="loading-details">Chargement...</div>}

        {error && <div className="error-details">Erreur: {error}</div>}

        {details && (
          <>
            <div className="details-header">
              <div className="details-teams">
                <div className="details-team">
                  {details.teams?.home?.logo && (
                    <img src={details.teams.home.logo} alt={details.teams.home.name} className="details-logo" />
                  )}
                  <h3>{details.teams?.home?.name}</h3>
                </div>
                <div className="details-score-container">
                  <div className="details-score">
                    <span className="score-large">{details.goals?.home ?? '-'}</span>
                    <span className="score-separator">-</span>
                    <span className="score-large">{details.goals?.away ?? '-'}</span>
                  </div>
                  {details.score?.halftime && (
                    <div className="halftime-score">
                      Mi-temps: {details.score.halftime.home} - {details.score.halftime.away}
                    </div>
                  )}
                  {details.events && details.events.length > 0 && (
                    <div className="goals-summary">
                      <div className="goals-column goals-home">
                        {details.events
                          .filter(event => event.type === 'Goal' && event.team.id === details.teams.home.id)
                          .map((goal, idx) => (
                            <div key={idx} className="goal-summary-item">
                              <span className="goal-summary-scorer">{goal.player.name}</span>
                              <span className="goal-summary-minute">{goal.time.elapsed}'</span>
                            </div>
                          ))}
                      </div>
                      <div className="goals-column goals-away">
                        {details.events
                          .filter(event => event.type === 'Goal' && event.team.id === details.teams.away.id)
                          .map((goal, idx) => (
                            <div key={idx} className="goal-summary-item">
                              <span className="goal-summary-minute">{goal.time.elapsed}'</span>
                              <span className="goal-summary-scorer">{goal.player.name}</span>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}
                </div>
                <div className="details-team">
                  {details.teams?.away?.logo && (
                    <img src={details.teams.away.logo} alt={details.teams.away.name} className="details-logo" />
                  )}
                  <h3>{details.teams?.away?.name}</h3>
                </div>
              </div>
              <div className="details-meta">
                <p className="details-date">
                  {new Date(details.fixture?.date).toLocaleDateString('fr-FR', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
                <p className="details-time">
                  {new Date(details.fixture?.date).toLocaleTimeString('fr-FR', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
                {details.fixture?.venue?.name && <p className="details-venue">{details.fixture.venue.name}, {details.fixture.venue.city}</p>}
              </div>
            </div>

            <div className="details-section">
              <h4>Informations</h4>
              <div className="info-grid">
                <div className="info-item">
                  <span className="info-label">Compétition</span>
                  <span className="info-value">{details.league?.name}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Phase</span>
                  <span className="info-value">{details.league?.round}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Statut</span>
                  <span className="info-value">{details.fixture?.status?.long}</span>
                </div>
                {details.fixture?.status?.elapsed && (
                  <div className="info-item">
                    <span className="info-label">Minute</span>
                    <span className="info-value">{details.fixture.status.elapsed}'</span>
                  </div>
                )}
              </div>
            </div>

            {details.events && details.events.filter(e => e.type === 'Card').length > 0 && (
              <div className="details-section">
                <h4>Cartons</h4>
                <div className="referees-list">
                  {details.events.filter(e => e.type === 'Card').map((card, idx) => (
                    <div key={idx} className="referee-item">
                      <span>{card.player.name}</span>
                      <span className="referee-type">{card.detail} - {card.time.elapsed}'</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {details.fixture?.referee && (
              <div className="details-section">
                <h4>Arbitre</h4>
                <div className="referees-list">
                  <div className="referee-item">
                    <span>{details.fixture.referee}</span>
                    <span className="referee-type">Arbitre principal</span>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default MatchDetailsPanel;
