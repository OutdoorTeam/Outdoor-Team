import * as React from 'react';
import { StudentsTable } from '../components/admin/StudentsTable';
import { PlanImporter } from '../components/admin/PlanImporter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, FileUp, BarChart3 } from 'lucide-react';

export function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">Panel de Administración</h1>
        <div className="text-primary font-medium">Outdoor Team Admin</div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="bg-card border-border border-2">
          <CardHeader>
            <CardTitle className="text-foreground text-xl flex items-center gap-2">
              <Users className="h-6 w-6 text-primary" />
              Gestión de Alumnos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <StudentsTable />
          </CardContent>
        </Card>

        <Card className="bg-card border-border border-2">
          <CardHeader>
            <CardTitle className="text-foreground text-xl flex items-center gap-2">
              <FileUp className="h-6 w-6 text-primary" />
              Importar Planes de Entrenamiento
            </CardTitle>
          </CardHeader>
          <CardContent>
            <PlanImporter />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
