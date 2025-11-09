import { useState } from 'react';
import Match from './components/Match';
import Bracket from './components/Bracket';
import MatchDetailsPanel from './components/MatchDetailsPanel';
import StandingsModal from './components/StandingsModal';
import { useMatches } from './hooks/useMatches';
import { groupMatchesByDate } from './utils/matchUtils';
import './App.css';

function App() {
  const [selectedSeason, setSelectedSeason] = useState(null);
  const { matches, loading, error } = useMatches(selectedSeason);
  const [selectedPhase, setSelectedPhase] = useState(null);
  const [selectedMatchId, setSelectedMatchId] = useState(null);
  const [showStandings, setShowStandings] = useState(false);

  const seasons = [
    { value: null, label: '2025/26' },
    { value: 2024, label: '2024/23' },
    { value: 2023, label: '2023/24' },
  ];

  if (loading) {
    return (
      <div className="container">
        <div className="loading">Loading matches...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="error">Error: {error}</div>
      </div>
    );
  }

  const filterMatches = () => {
    if (!selectedPhase) return matches;

    if (selectedPhase === 'league') {
      return matches.filter(match =>
        match.stage === 'Group Stage' || match.stage === 'League Phase'
      );
    }

    if (selectedPhase === 'knockout') {
      return matches.filter(match =>
        match.stage !== 'Group Stage' &&
        match.stage !== 'League Phase' &&
        match.stage !== 'Preliminary Round'
      );
    }

    return matches;
  };

  const filteredMatches = filterMatches();
  const groupedMatches = groupMatchesByDate(filteredMatches);

  return (
    <>
      <div className="phase-filters">
                <button
          className="phase-badge standings-badge"
          onClick={() => setShowStandings(true)}
        >
          Classement
        </button>
        <button
          className={`phase-badge ${selectedPhase === 'league' ? 'active' : ''}`}
          onClick={() => setSelectedPhase(selectedPhase === 'league' ? null : 'league')}
        >
          Phase de ligue
        </button>
        <button
          className={`phase-badge ${selectedPhase === 'knockout' ? 'active' : ''}`}
          onClick={() => setSelectedPhase(selectedPhase === 'knockout' ? null : 'knockout')}
        >
          Phase éliminatoire
        </button>
      </div>

      <div className="season-selector">
        <select
          value={selectedSeason || ''}
          onChange={(e) => setSelectedSeason(e.target.value ? parseInt(e.target.value) : null)}
          className="season-select"
        >
          {seasons.map((season) => (
            <option key={season.value || 'current'} value={season.value || ''}>
              {season.label}
            </option>
          ))}
        </select>
      </div>

      {selectedPhase === 'knockout' ? (
        <div className="bracket-wrapper">
          <Bracket matches={filteredMatches} onMatchClick={setSelectedMatchId} />
        </div>
      ) : (
        <div className="container">
          <div className="matches">
            {filteredMatches.length === 0 ? (
              <div className="no-matches">
                {matches.length === 0 ? 'No matches found. Syncing with API...' : 'Aucun match pour cette phase.'}
              </div>
            ) : (
              Object.entries(groupedMatches).map(([date, dateMatches]) => (
                <div key={date} className="date-group">
                  <div className="date-header">{date}</div>
                  <div className="date-matches">
                    {dateMatches.map((match) => (
                      <Match
                        key={match._id}
                        title={match.title}
                        team1={match.team1}
                        team2={match.team2}
                        status={match.status}
                        minute={match.minute}
                        date={match.date}
                        onClick={() => setSelectedMatchId(match.matchId)}
                      />
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      <MatchDetailsPanel
        matchId={selectedMatchId}
        onClose={() => setSelectedMatchId(null)}
      />

      {showStandings && (
        <StandingsModal
          season={selectedSeason}
          onClose={() => setShowStandings(false)}
        />
      )}
    </>
  );
}

export default App;
