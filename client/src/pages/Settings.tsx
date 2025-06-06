import * as React from 'react';
import { PaymentSection } from '../components/settings/PaymentSection';
import { HabitSettings } from '../components/settings/HabitSettings';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function Settings() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-foreground">Configuración</h1>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground text-xl">Suscripción</CardTitle>
          </CardHeader>
          <CardContent>
            <PaymentSection />
          </CardContent>
        </Card>
        
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground text-xl">Gestión de Hábitos</CardTitle>
          </CardHeader>
          <CardContent>
            <HabitSettings />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
