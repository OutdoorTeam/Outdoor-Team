import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CreditCard, Check, Calendar } from 'lucide-react';

export function PaymentSection() {
  const [subscriptionStatus] = React.useState('inactive'); // This would come from API

  return (
    <div className="space-y-4">
      {subscriptionStatus === 'active' ? (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2 text-green-700">
              <Check className="h-5 w-5" />
              <span className="font-medium">Suscripción Activa</span>
            </div>
            <p className="text-sm text-green-600 mt-1">
              Tu plan está activo hasta el 15 de febrero, 2025
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2 text-orange-700">
              <Calendar className="h-5 w-5" />
              <span className="font-medium">Sin Suscripción Activa</span>
            </div>
            <p className="text-sm text-orange-600 mt-1">
              Suscríbete para acceder a todas las funciones
            </p>
          </CardContent>
        </Card>
      )}

      <div className="space-y-3">
        <div className="border rounded-lg p-4">
          <h3 className="font-medium mb-2">Plan Mensual</h3>
          <div className="flex justify-between items-center">
            <div>
              <div className="text-2xl font-bold">$50</div>
              <div className="text-sm text-muted-foreground">por mes</div>
            </div>
            <Button>
              <CreditCard className="h-4 w-4 mr-2" />
              Suscribirse
            </Button>
          </div>
          <ul className="text-sm text-muted-foreground mt-3 space-y-1">
            <li>• Plan de entrenamiento personalizado</li>
            <li>• Seguimiento de hábitos</li>
            <li>• Sesión 1:1 incluida</li>
            <li>• Soporte prioritario</li>
          </ul>
        </div>

        <div className="border rounded-lg p-4">
          <h3 className="font-medium mb-2">Plan Trimestral</h3>
          <div className="flex justify-between items-center">
            <div>
              <div className="flex items-baseline space-x-2">
                <div className="text-2xl font-bold">$120</div>
                <div className="text-sm text-green-600 font-medium">Ahorra $30</div>
              </div>
              <div className="text-sm text-muted-foreground">por 3 meses</div>
            </div>
            <Button>
              <CreditCard className="h-4 w-4 mr-2" />
              Suscribirse
            </Button>
          </div>
        </div>
      </div>

      {subscriptionStatus === 'active' && (
        <div className="pt-4 border-t">
          <Button variant="outline" className="w-full">
            Renovar Suscripción
          </Button>
        </div>
      )}
    </div>
  );
}
