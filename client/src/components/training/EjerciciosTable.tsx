import * as React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';

interface Ejercicio {
  ejercicio: string;
  series: number | null;
  repeticiones: string | null;
  pausa: string | null;
  intensidad: string | null;
  video_url: string | null;
}

interface EjerciciosTableProps {
  ejercicios: Ejercicio[];
}

export function EjerciciosTable({ ejercicios }: EjerciciosTableProps) {
  const handleVideoClick = (videoUrl: string) => {
    window.open(videoUrl, '_blank');
  };

  const getIntensityBadge = (intensidad: string | null) => {
    if (!intensidad) return '-';
    
    const getIntensityColor = (intensidad: string) => {
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
      <span className={`px-2 py-1 rounded-full text-sm font-medium ${getIntensityColor(intensidad)}`}>
        {intensidad}
      </span>
    );
  };

  return (
    <div className="rounded-lg border-2 border-border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-primary/10 hover:bg-primary/20 border-b-2 border-primary/30">
            <TableHead className="text-foreground font-bold text-base py-4">Ejercicio</TableHead>
            <TableHead className="text-foreground font-bold text-base py-4 text-center">Series</TableHead>
            <TableHead className="text-foreground font-bold text-base py-4 text-center">Repeticiones</TableHead>
            <TableHead className="text-foreground font-bold text-base py-4 text-center">Pausa</TableHead>
            <TableHead className="text-foreground font-bold text-base py-4 text-center">Intensidad</TableHead>
            <TableHead className="text-foreground font-bold text-base py-4 text-center">Video</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {ejercicios.map((ejercicio, index) => (
            <TableRow 
              key={index} 
              className={`
                hover:bg-muted/50 transition-colors border-b border-border
                ${index % 2 === 0 ? 'bg-card' : 'bg-background/30'}
              `}
            >
              <TableCell className="font-medium text-foreground text-base py-4">
                {ejercicio.ejercicio}
              </TableCell>
              <TableCell className="text-center text-foreground text-base py-4">
                <span className="font-bold text-primary text-lg">
                  {ejercicio.series || '-'}
                </span>
              </TableCell>
              <TableCell className="text-center text-foreground text-base py-4">
                <span className="font-bold text-primary text-lg">
                  {ejercicio.repeticiones || '-'}
                </span>
              </TableCell>
              <TableCell className="text-center text-foreground text-base py-4">
                <span className="font-bold text-primary text-lg">
                  {ejercicio.pausa || '-'}
                </span>
              </TableCell>
              <TableCell className="text-center py-4">
                {getIntensityBadge(ejercicio.intensidad)}
              </TableCell>
              <TableCell className="text-center py-4">
                {ejercicio.video_url ? (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleVideoClick(ejercicio.video_url!)}
                    className="text-primary hover:text-primary-foreground hover:bg-primary"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                ) : (
                  <span className="text-muted-foreground">-</span>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
