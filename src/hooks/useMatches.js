import { useState, useEffect, useCallback } from 'react';
import { sortMatches } from '../utils/matchUtils';

const API_URL = 'http://localhost:5000/api';

export const useMatches = (season = null) => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const syncMatches = useCallback(async (showLoader = false) => {
    try {
      if (showLoader) {
        setLoading(true);
      }

      const response = await fetch(`${API_URL}/sync-matches`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ season }),
      });

      if (!response.ok) {
        throw new Error('Failed to sync matches');
      }

      const data = await response.json();
      const sortedData = sortMatches(data.matches);

      setMatches(sortedData);
      setError(null);

      if (!showLoader) {
        console.log(`🔄 Auto-sync: ${data.count} matches updated at ${new Date().toLocaleTimeString()}`);
      }
    } catch (err) {
      if (showLoader) {
        setError(err.message);
      }
      console.error('Error syncing matches:', err);
    } finally {
      if (showLoader) {
        setLoading(false);
      }
    }
  }, [season]);

  useEffect(() => {
    syncMatches(true);

    const interval = setInterval(() => {
      syncMatches(false);
    }, 60000);

    return () => clearInterval(interval);
  }, [syncMatches]);

  return { matches, loading, error };
};
