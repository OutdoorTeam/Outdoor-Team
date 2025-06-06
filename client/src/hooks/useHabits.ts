import * as React from 'react';

interface Habit {
  id: number;
  name: string;
  description: string | null;
  points: number;
  completion_id: number | null;
}

export function useHabits() {
  const [habits, setHabits] = React.useState<Habit[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const fetchHabits = React.useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/habits/today');
      if (!response.ok) throw new Error('Failed to fetch habits');
      const data = await response.json();
      setHabits(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, []);

  const toggleHabit = React.useCallback(async (habitId: number) => {
    try {
      const response = await fetch(`/api/habits/${habitId}/toggle`, {
        method: 'POST',
      });
      if (!response.ok) throw new Error('Failed to toggle habit');
      
      // Refresh habits after toggling
      await fetchHabits();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    }
  }, [fetchHabits]);

  const initializeHabits = React.useCallback(async () => {
    try {
      const response = await fetch('/api/habits/initialize', {
        method: 'POST',
      });
      if (!response.ok) throw new Error('Failed to initialize habits');
      
      // Refresh habits after initialization
      await fetchHabits();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    }
  }, [fetchHabits]);

  React.useEffect(() => {
    fetchHabits();
  }, [fetchHabits]);

  return {
    habits,
    loading,
    error,
    toggleHabit,
    initializeHabits,
    refetch: fetchHabits,
  };
}
