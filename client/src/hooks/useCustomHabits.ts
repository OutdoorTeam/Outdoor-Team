import * as React from 'react';

export function useCustomHabits() {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const addCustomHabit = React.useCallback(async (name: string, description: string, points: number) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/habits/custom', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, description, points }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to add custom habit');
      }
      
      const result = await response.json();
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    addCustomHabit,
    loading,
    error,
  };
}
