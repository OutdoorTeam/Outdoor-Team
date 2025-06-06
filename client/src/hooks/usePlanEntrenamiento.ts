import * as React from 'react';

interface EjercicioPlan {
  dia: number;
  ejercicio: string;
  series: number | null;
  repeticiones: string | null;
  pausa: string | null;
  intensidad: string | null;
  video_url: string | null;
  orden: number | null;
}

interface PlanEntrenamiento {
  id: number;
  nombre: string;
  objetivo: string | null;
  frecuencia: string | null;
  pasos_diarios: number | null;
  pausas_activas: string | null;
  duracion: string | null;
  descripcion: string | null;
}

interface Alumno {
  id: number;
  nombre: string;
  objetivo: string | null;
  plan_asignado: number | null;
}

interface PlanData {
  plan: PlanEntrenamiento;
  alumno: Alumno;
  ejercicios_por_dia: Record<number, EjercicioPlan[]>;
}

export function usePlanEntrenamiento() {
  const [planData, setPlanData] = React.useState<PlanData | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const fetchPlan = React.useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/plan-entrenamiento');
      if (!response.ok) throw new Error('Failed to fetch training plan');
      const data = await response.json();
      setPlanData(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchPlan();
  }, [fetchPlan]);

  return {
    planData,
    loading,
    error,
    refetch: fetchPlan,
  };
}
