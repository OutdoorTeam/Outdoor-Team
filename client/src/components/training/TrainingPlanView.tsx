import * as React from 'react';
import { useTrainingPlan } from '../../hooks/useTrainingPlan';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ExerciseCard } from './ExerciseCard';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, Target } from 'lucide-react';

const DAYS_OF_WEEK = [
  'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'
];

export function TrainingPlanView() {
  const { trainingPlan, loading, error } = useTrainingPlan();

  if (loading) {
    return <div className="text-center py-8">Cargando plan de entrenamiento...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-destructive">Error: {error}</div>;
  }

  if (!trainingPlan) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <Target className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No tienes un plan de entrenamiento asignado</h3>
          <p className="text-muted-foreground mb-4">
            Contacta con tu entrenador para recibir tu plan personalizado.
          </p>
          <Button>Contactar Entrenador</Button>
        </CardContent>
      </Card>
    );
  }

  const exercisesByDay = trainingPlan.exercises.reduce((acc, exercise) => {
    if (!acc[exercise.day_of_week]) {
      acc[exercise.day_of_week] = [];
    }
    acc[exercise.day_of_week].push(exercise);
    return acc;
  }, {} as Record<number, typeof trainingPlan.exercises>);

  const totalExercises = trainingPlan.exercises.length;
  const activeDays = Object.keys(exercisesByDay).length;

  return (
    <div className="space-y-6">
      {/* Plan Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            {trainingPlan.name}
          </CardTitle>
          {trainingPlan.description && (
            <p className="text-muted-foreground">{trainingPlan.description}</p>
          )}
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-primary" />
              <div>
                <div className="text-sm font-medium">Duración</div>
                <div className="text-xs text-muted-foreground">
                  {trainingPlan.start_date && trainingPlan.end_date ? (
                    `${new Date(trainingPlan.start_date).toLocaleDateString()} - ${new Date(trainingPlan.end_date).toLocaleDateString()}`
                  ) : 'Permanente'}
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" />
              <div>
                <div className="text-sm font-medium">{activeDays} días/semana</div>
                <div className="text-xs text-muted-foreground">Días activos</div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-primary" />
              <div>
                <div className="text-sm font-medium">{totalExercises} ejercicios</div>
                <div className="text-xs text-muted-foreground">Total en el plan</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Training Schedule */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Cronograma de Entrenamiento</h2>
        
        {DAYS_OF_WEEK.map((dayName, index) => {
          const dayNumber = index + 1;
          const dayExercises = exercisesByDay[dayNumber] || [];
          
          if (dayExercises.length === 0) {
            return (
              <Card key={dayNumber} className="opacity-50">
                <CardHeader className="py-4">
                  <CardTitle className="text-base flex items-center justify-between">
                    <span>{dayName}</span>
                    <span className="text-sm font-normal text-muted-foreground">Día de descanso</span>
                  </CardTitle>
                </CardHeader>
              </Card>
            );
          }

          return (
            <Card key={dayNumber}>
              <CardHeader>
                <CardTitle className="text-lg flex items-center justify-between">
                  <span>{dayName}</span>
                  <span className="text-sm font-normal text-muted-foreground">
                    {dayExercises.length} ejercicio{dayExercises.length !== 1 ? 's' : ''}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
                  {dayExercises.map((exercise, idx) => (
                    <ExerciseCard key={idx} exercise={exercise} />
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
