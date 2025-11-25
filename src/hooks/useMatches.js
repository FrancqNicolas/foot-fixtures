import { useState, useEffect, useCallback } from 'react';
import { API_URL, SYNC_INTERVAL } from '../config/api';
import { sortMatches } from '../utils/matchUtils';

export const useMatches = (season = null) => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const syncMatches = useCallback(async (showLoader = false) => {
    try {
      if (showLoader) setLoading(true);

      const response = await fetch(`${API_URL}/sync`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ season }),
      });

      if (!response.ok) throw new Error('Failed to sync matches');

      const data = await response.json();
      setMatches(sortMatches(data.matches));
      setError(null);
    } catch (err) {
      if (showLoader) setError(err.message);
      console.error('Error syncing matches:', err);
    } finally {
      if (showLoader) setLoading(false);
    }
  }, [season]);

  useEffect(() => {
    syncMatches(true);
    const interval = setInterval(() => syncMatches(false), SYNC_INTERVAL);
    return () => clearInterval(interval);
  }, [syncMatches]);

  return { matches, loading, error };
};
