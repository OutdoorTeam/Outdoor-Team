import * as React from 'react';

interface Points {
  total_points: number;
  completed_habits: number;
  weekly_points: number;
}

export function usePoints() {
  const [points, setPoints] = React.useState<Points>({ total_points: 0, completed_habits: 0, weekly_points: 0 });
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const fetchPoints = React.useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/points/today');
      if (!response.ok) throw new Error('Failed to fetch points');
      const data = await response.json();
      setPoints(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchPoints();
    
    // Refresh points every 30 seconds
    const interval = setInterval(fetchPoints, 30000);
    return () => clearInterval(interval);
  }, [fetchPoints]);

  return {
    points,
    loading,
    error,
    refetch: fetchPoints,
  };
}
