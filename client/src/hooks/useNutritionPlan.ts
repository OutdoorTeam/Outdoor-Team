import * as React from 'react';

interface ComidaPlan {
  tipo_comida: string;
  nombre_comida: string;
  ingredientes: string | null;
  instrucciones: string | null;
  calorias: number | null;
  proteinas_g: number | null;
  carbohidratos_g: number | null;
  grasas_g: number | null;
  orden: number | null;
}

interface PlanNutricion {
  id: number;
  nombre: string;
  objetivo: string | null;
  descripcion: string | null;
  calorias_diarias: number | null;
  proteinas_g: number | null;
  carbohidratos_g: number | null;
  grasas_g: number | null;
}

interface Alumno {
  id: number;
  nombre: string;
  objetivo: string | null;
  plan_nutricion_asignado: number | null;
}

interface PlanData {
  plan: PlanNutricion;
  alumno: Alumno;
  comidas_por_tipo: Record<string, ComidaPlan[]>;
}

export function useNutritionPlan() {
  const [planData, setPlanData] = React.useState<PlanData | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const fetchPlan = React.useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/plan-nutricion');
      if (!response.ok) throw new Error('Failed to fetch nutrition plan');
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
