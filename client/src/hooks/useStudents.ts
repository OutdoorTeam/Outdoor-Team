import * as React from 'react';

interface Student {
  id: number;
  nombre: string;
  email: string;
  edad: number | null;
  objetivo: string | null;
  plan_asignado: number | null;
  fecha_pago: string | null;
  fecha_vencimiento: string | null;
  puntaje_total: number | null;
  observaciones: string | null;
}

export function useStudents() {
  const [students, setStudents] = React.useState<Student[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const fetchStudents = React.useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/students');
      if (!response.ok) throw new Error('Failed to fetch students');
      const data = await response.json();
      setStudents(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  return {
    students,
    loading,
    error,
    refetch: fetchStudents,
  };
}
