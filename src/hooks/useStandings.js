import { useState, useEffect } from 'react';
import { API_URL } from '../config/api';

export const useStandings = (season = null) => {
  const [standings, setStandings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStandings = async () => {
    try {
      setLoading(true);
      const url = season ? `${API_URL}/standings?season=${season}` : `${API_URL}/standings`;
      const response = await fetch(url);

      if (!response.ok) throw new Error('Failed to fetch standings');

      const data = await response.json();
      setStandings(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching standings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStandings();
  }, [season]);

  return { standings, loading, error, refetch: fetchStandings };
};
