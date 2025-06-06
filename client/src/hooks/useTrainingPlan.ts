import * as React from 'react';

interface TrainingPlanExercise {
  day_of_week: number;
  sets: number | null;
  reps: string | null;
  rest_time: string | null;
  notes: string | null;
  name: string;
  description: string | null;
  youtube_url: string | null;
  muscle_groups: string | null;
  difficulty_level: string | null;
}

interface TrainingPlan {
  id: number;
  name: string;
  description: string | null;
  start_date: string | null;
  end_date: string | null;
  exercises: TrainingPlanExercise[];
}

export function useTrainingPlan() {
  const [trainingPlan, setTrainingPlan] = React.useState<TrainingPlan | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const fetchTrainingPlan = React.useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/training-plan');
      if (!response.ok) throw new Error('Failed to fetch training plan');
      const data = await response.json();
      setTrainingPlan(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchTrainingPlan();
  }, [fetchTrainingPlan]);

  return {
    trainingPlan,
    loading,
    error,
    refetch: fetchTrainingPlan,
  };
}
