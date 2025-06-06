import * as React from 'react';
import { useStudents } from '../../hooks/useStudents';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { format, isAfter, isBefore, addDays, parseISO } from 'date-fns';

export function StudentsTable() {
  const { students, loading, error } = useStudents();

  const getSubscriptionStatus = (fechaVencimiento: string | null) => {
    if (!fechaVencimiento) return 'sin-datos';

    const today = new Date();
    const vencimiento = parseISO(fechaVencimiento);
    const sevenDaysFromNow = addDays(today, 7);

    if (isBefore(vencimiento, today)) {
      return 'vencida';
    } else if (isBefore(vencimiento, sevenDaysFromNow)) {
      return 'por-vencer';
    } else {
      return 'activa';
    }
  };

  const getStatusBadge = (status: string, fechaVencimiento: string | null) => {
    switch (status) {
      case 'vencida':
        return (
          <Badge className="bg-red-600 text-white hover:bg-red-700">
            <XCircle className="h-3 w-3 mr-1" />
            Vencida
          </Badge>
        );
      case 'por-vencer':
        return (
          <Badge className="bg-yellow-600 text-white hover:bg-yellow-700">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Por vencer
          </Badge>
        );
      case 'activa':
        return (
          <Badge className="bg-green-600 text-white hover:bg-green-700">
            <CheckCircle className="h-3 w-3 mr-1" />
            Activa
          </Badge>
        );
      default:
        return (
          <Badge className="bg-muted text-muted-foreground">
            Sin datos
          </Badge>
        );
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    try {
      return format(parseISO(dateString), 'dd/MM/yyyy');
    } catch {
      return 'Fecha inválida';
    }
  };

  const handleViewPlan = (studentId: number) => {
    alert(`Ver plan del alumno ID: ${studentId}`);
  };

  if (loading) {
    return <div className="text-center py-8 text-foreground">Cargando alumnos...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-destructive">Error: {error}</div>;
  }

  if (students.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground mb-4">No hay alumnos registrados</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Mobile View */}
      <div className="block sm:hidden space-y-3">
        {students.map((student) => {
          const status = getSubscriptionStatus(student.fecha_vencimiento);
          return (
            <div
              key={student.id}
              className={`
                p-4 rounded-lg border-2 border-border bg-card
                ${status === 'vencida' ? 'bg-red-950/20 border-red-600/50' : ''}
                ${status === 'por-vencer' ? 'bg-yellow-950/20 border-yellow-600/50' : ''}
              `}
            >
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-bold text-primary text-lg">{student.nombre}</div>
                    <div className="text-sm text-muted-foreground">{student.email}</div>
                    {student.objetivo && (
                      <div className="text-sm text-muted-foreground mt-1">{student.objetivo}</div>
                    )}
                  </div>
                  {getStatusBadge(status, student.fecha_vencimiento)}
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-muted-foreground">Vencimiento</div>
                    <div className={`font-medium ${status === 'vencida' ? 'text-red-400' : status === 'por-vencer' ? 'text-yellow-400' : 'text-green-400'}`}>
                      {formatDate(student.fecha_vencimiento)}
                    </div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Puntos</div>
                    <div className="font-bold text-primary text-lg">{student.puntaje_total || 0}</div>
                  </div>
                </div>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleViewPlan(student.id)}
                  className="w-full text-primary hover:text-primary-foreground hover:bg-primary"
                  disabled={!student.plan_asignado}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Ver Plan
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Desktop View */}
      <div className="hidden sm:block rounded-lg border-2 border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-primary/10 hover:bg-primary/20 border-b-2 border-primary/30">
              <TableHead className="text-foreground font-bold text-base py-4">Alumno</TableHead>
              <TableHead className="text-foreground font-bold text-base py-4">Email</TableHead>
              <TableHead className="text-foreground font-bold text-base py-4 text-center">Estado</TableHead>
              <TableHead className="text-foreground font-bold text-base py-4 text-center">Vencimiento</TableHead>
              <TableHead className="text-foreground font-bold text-base py-4 text-center">Puntos</TableHead>
              <TableHead className="text-foreground font-bold text-base py-4 text-center">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {students.map((student, index) => {
              const status = getSubscriptionStatus(student.fecha_vencimiento);
              return (
                <TableRow
                  key={student.id}
                  className={`
                    hover:bg-muted/50 transition-colors border-b border-border
                    ${index % 2 === 0 ? 'bg-card' : 'bg-background/30'}
                    ${status === 'vencida' ? 'bg-red-950/20' : ''}
                    ${status === 'por-vencer' ? 'bg-yellow-950/20' : ''}
                  `}
                >
                  <TableCell className="font-medium text-foreground text-base py-4">
                    <div>
                      <div className="font-bold text-primary">{student.nombre}</div>
                      {student.objetivo && (
                        <div className="text-sm text-muted-foreground">{student.objetivo}</div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-foreground text-base py-4">
                    {student.email}
                  </TableCell>
                  <TableCell className="text-center py-4">
                    {getStatusBadge(status, student.fecha_vencimiento)}
                  </TableCell>
                  <TableCell className="text-center text-foreground text-base py-4">
                    <div className={`font-medium ${status === 'vencida' ? 'text-red-400' : status === 'por-vencer' ? 'text-yellow-400' : 'text-green-400'}`}>
                      {formatDate(student.fecha_vencimiento)}
                    </div>
                  </TableCell>
                  <TableCell className="text-center py-4">
                    <span className="font-bold text-primary text-lg">
                      {student.puntaje_total || 0}
                    </span>
                  </TableCell>
                  <TableCell className="text-center py-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleViewPlan(student.id)}
                      className="text-primary hover:text-primary-foreground hover:bg-primary"
                      disabled={!student.plan_asignado}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      Ver Plan
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      <div className="text-sm text-muted-foreground">
        Total de alumnos: {students.length}
      </div>
    </div>
  );
}
