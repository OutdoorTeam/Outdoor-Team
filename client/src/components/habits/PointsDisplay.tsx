import * as React from 'react';
import { usePoints } from '../../hooks/usePoints';
import { Card, CardContent } from '@/components/ui/card';
import { Trophy, Target, Calendar } from 'lucide-react';

export function PointsDisplay() {
  const { points, loading } = usePoints();

  if (loading) {
    return (
      <Card className="bg-card border-border">
        <CardContent className="p-3 sm:p-4">
          <div className="text-center text-foreground text-sm sm:text-base">Cargando...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card border-border">
      <CardContent className="p-3 sm:p-4">
        <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-6">
          <div className="flex items-center space-x-2">
            <Trophy className="h-5 w-5 sm:h-6 sm:w-6 text-primary flex-shrink-0" />
            <div className="text-center sm:text-left">
              <div className="font-bold text-lg sm:text-xl text-foreground">{points.total_points}</div>
              <div className="text-xs sm:text-sm text-muted-foreground">Puntos Hoy</div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Target className="h-5 w-5 sm:h-6 sm:w-6 text-primary flex-shrink-0" />
            <div className="text-center sm:text-left">
              <div className="font-bold text-lg sm:text-xl text-foreground">{points.completed_habits}</div>
              <div className="text-xs sm:text-sm text-muted-foreground">Hábitos</div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Calendar className="h-5 w-5 sm:h-6 sm:w-6 text-primary flex-shrink-0" />
            <div className="text-center sm:text-left">
              <div className="font-bold text-lg sm:text-xl text-foreground">{points.weekly_points}</div>
              <div className="text-xs sm:text-sm text-muted-foreground">Esta Semana</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
