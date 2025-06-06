import * as React from 'react';
import { NutritionPlanView } from '../components/nutrition/NutritionPlanView';
import { parseISO, differenceInDays } from 'date-fns';

export function Nutrition() {
  // Para el demo, simulamos datos de usuario. En producción vendría del contexto de autenticación
  const user = {
    subscription_end_date: '2025-02-15' // Fecha de ejemplo para testing
  };

  const diasRestantes = user?.subscription_end_date
    ? differenceInDays(parseISO(user.subscription_end_date), new Date())
    : null;

  if (diasRestantes !== null && diasRestantes < 0) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-foreground">Plan de Nutrición</h1>
        <div className="bg-red-600/20 border-2 border-red-600 text-red-300 p-6 rounded-lg text-center">
          <h2 className="text-xl font-bold mb-2">Suscripción Vencida</h2>
          <p className="text-lg">Tu suscripción ha vencido. Renuévala para seguir accediendo al plan nutricional.</p>
        </div>
      </div>
    );
  }

  if (diasRestantes !== null && diasRestantes <= 7) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-foreground">Plan de Nutrición</h1>
        <div className="bg-yellow-600/20 border-2 border-yellow-600 text-yellow-300 p-6 rounded-lg text-center">
          <h2 className="text-xl font-bold mb-2">⚠️ Suscripción Próxima a Vencer</h2>
          <p className="text-lg">Tu suscripción vence en {diasRestantes} día(s). Renuévala pronto para continuar.</p>
        </div>
        <NutritionPlanView />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-foreground">Plan de Nutrición</h1>
      <NutritionPlanView />
    </div>
  );
}
