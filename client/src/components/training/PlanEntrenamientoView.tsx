import * as React from 'react';
import { usePlanEntrenamiento } from '../../hooks/usePlanEntrenamiento';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EjerciciosTable } from './EjerciciosTable';
import { Button } from '@/components/ui/button';
import { Dumbbell, Target, Clock, Activity, ChevronDown, ChevronUp } from 'lucide-react';

const DIAS_NOMBRES = {
  1: 'Día 1',
  2: 'Día 2', 
  3: 'Día 3',
  4: 'Día 4'
};

export function PlanEntrenamientoView() {
  const { planData, loading, error } = usePlanEntrenamiento();
  const [openDays, setOpenDays] = React.useState<Record<number, boolean>>({
    1: true,
    2: false,
    3: false,
    4: false
  });

  const toggleDay = (dia: number) => {
    setOpenDays(prev => ({
      ...prev,
      [dia]: !prev[dia]
    }));
  };

  if (loading) {
    return <div className="text-center py-8 text-foreground text-lg">Cargando plan de entrenamiento...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-destructive text-lg">Error: {error}</div>;
  }

  if (!planData) {
    return (
      <Card className="bg-card border-border">
        <CardContent className="p-8 text-center">
          <Target className="h-12 w-12 mx-auto text-primary mb-4" />
          <h3 className="text-xl font-medium mb-2 text-foreground">No tienes un plan de entrenamiento asignado</h3>
          <p className="text-muted-foreground mb-4 text-lg">
            Contacta con tu entrenador para recibir tu plan personalizado.
          </p>
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
            Contactar Entrenador
          </Button>
        </CardContent>
      </Card>
    );
  }

  const { plan, alumno, ejercicios_por_dia } = planData;
  const totalEjercicios = Object.values(ejercicios_por_dia).flat().length;

  return (
    <div className="space-y-6">
      {/* Plan Header */}
      <Card className="bg-card border-border border-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground text-2xl">
            <Dumbbell className="h-6 w-6 text-primary" />
            {plan.nombre}
          </CardTitle>
          {plan.descripcion && (
            <p className="text-muted-foreground text-lg">{plan.descripcion}</p>
          )}
          {plan.objetivo && (
            <p className="text-primary font-medium text-lg">Objetivo: {plan.objetivo}</p>
          )}
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex items-center gap-3 p-4 bg-background/50 rounded-lg border-2 border-primary/30">
              <Activity className="h-5 w-5 text-primary" />
              <div>
                <div className="text-lg font-bold text-foreground">{plan.frecuencia || '4 días/semana'}</div>
                <div className="text-sm text-muted-foreground">Frecuencia</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-4 bg-background/50 rounded-lg border-2 border-primary/30">
              <Clock className="h-5 w-5 text-primary" />
              <div>
                <div className="text-lg font-bold text-foreground">{plan.duracion || '4 semanas'}</div>
                <div className="text-sm text-muted-foreground">Duración</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-4 bg-background/50 rounded-lg border-2 border-primary/30">
              <Target className="h-5 w-5 text-primary" />
              <div>
                <div className="text-lg font-bold text-foreground">{totalEjercicios} ejercicios</div>
                <div className="text-sm text-muted-foreground">Total en el plan</div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-background/50 rounded-lg border-2 border-primary/30">
              <Activity className="h-5 w-5 text-primary" />
              <div>
                <div className="text-lg font-bold text-foreground">{plan.pasos_diarios || 8000} pasos</div>
                <div className="text-sm text-muted-foreground">Meta diaria</div>
              </div>
            </div>
          </div>
          
          {plan.pausas_activas && (
            <div className="mt-4 p-4 bg-primary/10 border-2 border-primary/30 rounded-lg">
              <h4 className="font-medium text-foreground mb-1 text-lg">Pausas Activas</h4>
              <p className="text-muted-foreground text-base">{plan.pausas_activas}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Training Schedule */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-foreground">Cronograma de Entrenamiento</h2>
        
        {[1, 2, 3, 4].map((dia) => {
          const ejerciciosDia = ejercicios_por_dia[dia] || [];
          const isOpen = openDays[dia];
          
          if (ejerciciosDia.length === 0) {
            return (
              <Card key={dia} className="bg-card border-border border-2 opacity-60">
                <CardHeader className="py-6">
                  <CardTitle className="text-xl flex items-center justify-between text-foreground">
                    <span className="text-primary">{DIAS_NOMBRES[dia]}</span>
                    <span className="text-lg font-normal text-muted-foreground">Día de descanso</span>
                  </CardTitle>
                </CardHeader>
              </Card>
            );
          }

          return (
            <Card key={dia} className="bg-card border-border border-2">
              <CardHeader 
                className="cursor-pointer hover:bg-muted/50 transition-colors py-6"
                onClick={() => toggleDay(dia)}
              >
                <CardTitle className="text-xl flex items-center justify-between text-foreground">
                  <span className="text-primary">{DIAS_NOMBRES[dia]}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-normal text-muted-foreground">
                      {ejerciciosDia.length} ejercicio{ejerciciosDia.length !== 1 ? 's' : ''}
                    </span>
                    {isOpen ? (
                      <ChevronUp className="h-5 w-5 text-primary" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-primary" />
                    )}
                  </div>
                </CardTitle>
              </CardHeader>
              {isOpen && (
                <CardContent className="pt-0">
                  <EjerciciosTable ejercicios={ejerciciosDia} />
                </CardContent>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
