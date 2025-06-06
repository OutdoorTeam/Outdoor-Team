import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink, Dumbbell } from 'lucide-react';

interface Ejercicio {
  ejercicio: string;
  series: number | null;
  repeticiones: string | null;
  pausa: string | null;
  intensidad: string | null;
  video_url: string | null;
}

interface EjercicioCardProps {
  ejercicio: Ejercicio;
}

export function EjercicioCard({ ejercicio }: EjercicioCardProps) {
  const handleVideoClick = () => {
    if (ejercicio.video_url) {
      window.open(ejercicio.video_url, '_blank');
    }
  };

  const getIntensityColor = (intensidad: string | null) => {
    if (!intensidad) return 'bg-muted text-muted-foreground';
    
    switch (intensidad.toLowerCase()) {
      case 'baja':
      case 'suave':
        return 'bg-green-600 text-white';
      case 'moderada':
      case 'media':
        return 'bg-primary text-primary-foreground';
      case 'alta':
      case 'intensa':
        return 'bg-red-600 text-white';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <Card className="h-full bg-card border-border">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg flex items-center gap-2 text-foreground">
              <Dumbbell className="h-5 w-5 text-primary" />
              {ejercicio.ejercicio}
            </CardTitle>
          </div>
          {ejercicio.intensidad && (
            <span className={`text-sm px-3 py-1 rounded-full font-medium ${getIntensityColor(ejercicio.intensidad)}`}>
              {ejercicio.intensidad}
            </span>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="pt-0 space-y-4">
        {/* Variables de Entrenamiento */}
        <div className="bg-background/80 rounded-lg p-4 border border-border">
          <h4 className="font-medium text-lg mb-3 text-center text-foreground">Variables de Entrenamiento</h4>
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center">
              <div className="bg-card rounded-lg p-3 border-2 border-primary/50">
                <div className="text-xl font-bold text-primary">
                  {ejercicio.series || '-'}
                </div>
                <div className="text-sm text-muted-foreground font-medium">
                  Series
                </div>
              </div>
            </div>
            
            <div className="text-center">
              <div className="bg-card rounded-lg p-3 border-2 border-primary/50">
                <div className="text-xl font-bold text-primary">
                  {ejercicio.repeticiones || '-'}
                </div>
                <div className="text-sm text-muted-foreground font-medium">
                  Repeticiones
                </div>
              </div>
            </div>
            
            <div className="text-center">
              <div className="bg-card rounded-lg p-3 border-2 border-primary/50">
                <div className="text-xl font-bold text-primary">
                  {ejercicio.pausa || '-'}
                </div>
                <div className="text-sm text-muted-foreground font-medium">
                  Pausa
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Botón de video */}
        {ejercicio.video_url && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleVideoClick}
            className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground"
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            Ver Video Explicativo
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
