import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink, Dumbbell } from 'lucide-react';

interface Exercise {
  name: string;
  description: string | null;
  youtube_url: string | null;
  muscle_groups: string | null;
  difficulty_level: string | null;
  sets: number | null;
  reps: string | null;
  rest_time: string | null;
  notes: string | null;
}

interface ExerciseCardProps {
  exercise: Exercise;
}

export function ExerciseCard({ exercise }: ExerciseCardProps) {
  const handleVideoClick = () => {
    if (exercise.youtube_url) {
      window.open(exercise.youtube_url, '_blank');
    }
  };

  const getIntensityLevel = () => {
    if (exercise.difficulty_level) {
      return exercise.difficulty_level;
    }
    return 'Moderada';
  };

  const getIntensityColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'principiante':
      case 'fácil':
        return 'bg-green-100 text-green-800';
      case 'intermedio':
      case 'moderada':
        return 'bg-yellow-100 text-yellow-800';
      case 'avanzado':
      case 'difícil':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-base flex items-center gap-2">
              <Dumbbell className="h-4 w-4" />
              {exercise.name}
            </CardTitle>
            {exercise.muscle_groups && (
              <p className="text-sm text-muted-foreground mt-1">{exercise.muscle_groups}</p>
            )}
          </div>
          <span className={`text-xs px-2 py-1 rounded-full ${getIntensityColor(getIntensityLevel())}`}>
            {getIntensityLevel()}
          </span>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0 space-y-4">
        {/* Variables de Entrenamiento */}
        <div className="bg-accent/50 rounded-lg p-4">
          <h4 className="font-medium text-sm mb-3 text-center">Variables de Entrenamiento</h4>
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center">
              <div className="bg-background rounded-lg p-3 border">
                <div className="text-xl font-bold text-primary">
                  {exercise.sets || '-'}
                </div>
                <div className="text-xs text-muted-foreground font-medium">
                  Series
                </div>
              </div>
            </div>
            
            <div className="text-center">
              <div className="bg-background rounded-lg p-3 border">
                <div className="text-xl font-bold text-primary">
                  {exercise.reps || '-'}
                </div>
                <div className="text-xs text-muted-foreground font-medium">
                  Repeticiones
                </div>
              </div>
            </div>
            
            <div className="text-center">
              <div className="bg-background rounded-lg p-3 border">
                <div className="text-xl font-bold text-primary">
                  {exercise.rest_time || '-'}
                </div>
                <div className="text-xs text-muted-foreground font-medium">
                  Descanso
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Descripción */}
        {exercise.description && (
          <div className="space-y-2">
            <h5 className="font-medium text-sm">Descripción:</h5>
            <p className="text-sm text-muted-foreground">{exercise.description}</p>
          </div>
        )}

        {/* Notas específicas */}
        {exercise.notes && (
          <div className="space-y-2">
            <h5 className="font-medium text-sm">Notas importantes:</h5>
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-700">{exercise.notes}</p>
            </div>
          </div>
        )}

        {/* Botón de video */}
        {exercise.youtube_url && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleVideoClick}
            className="w-full"
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            Ver Video Explicativo
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
