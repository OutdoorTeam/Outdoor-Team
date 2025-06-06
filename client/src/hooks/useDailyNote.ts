import * as React from 'react';

interface DailyNote {
  content: string;
}

export function useDailyNote() {
  const [note, setNote] = React.useState<DailyNote | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const fetchNote = React.useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/notes/today');
      if (!response.ok) throw new Error('Failed to fetch note');
      const data = await response.json();
      setNote(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, []);

  const saveNote = React.useCallback(async (content: string) => {
    try {
      const response = await fetch('/api/notes/today', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content }),
      });
      if (!response.ok) throw new Error('Failed to save note');
      
      // Update local state
      setNote({ content });
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      throw err;
    }
  }, []);

  React.useEffect(() => {
    fetchNote();
  }, [fetchNote]);

  return {
    note,
    loading,
    error,
    saveNote,
    refetch: fetchNote,
  };
}
