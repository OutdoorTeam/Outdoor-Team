import * as React from 'react';
import { useNutritionPlan } from '../../hooks/useNutritionPlan';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MealCard } from './MealCard';
import { Button } from '@/components/ui/button';
import { Utensils, Target, Activity, TrendingUp } from 'lucide-react';

const MEAL_TYPES = {
  desayuno: 'Desayuno',
  almuerzo: 'Almuerzo',
  merienda: 'Merienda',
  cena: 'Cena'
};

export function NutritionPlanView() {
  const { planData, loading, error } = useNutritionPlan();

  if (loading) {
    return <div className="text-center py-8 text-foreground text-lg">Cargando plan de nutrición...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-destructive text-lg">Error: {error}</div>;
  }

  if (!planData) {
    return (
      <Card className="bg-card border-border">
        <CardContent className="p-8 text-center">
          <Utensils className="h-12 w-12 mx-auto text-primary mb-4" />
          <h3 className="text-xl font-medium mb-2 text-foreground">No tienes un plan de nutrición asignado</h3>
          <p className="text-muted-foreground mb-4 text-lg">
            Contacta con tu nutricionista para recibir tu plan personalizado.
          </p>
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
            Contactar Nutricionista
          </Button>
        </CardContent>
      </Card>
    );
  }

  const { plan, alumno, comidas_por_tipo } = planData;
  const totalComidas = Object.values(comidas_por_tipo).flat().length;

  return (
    <div className="space-y-6">
      {/* Plan Header */}
      <Card className="bg-card border-border border-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground text-2xl">
            <Utensils className="h-6 w-6 text-primary" />
            {plan.nombre}
          </CardTitle>
          {plan.descripcion && (
            <p className="text-muted-foreground text-lg">{plan.descripcion}</p>
          )}
          {plan.objetivo && (
            <p className="text-primary font-medium text-lg">Objetivo: {plan.objetivo}</p>
          )}
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex items-center gap-3 p-4 bg-background/50 rounded-lg border-2 border-primary/30">
              <Target className="h-5 w-5 text-primary" />
              <div>
                <div className="text-lg font-bold text-foreground">{plan.calorias_diarias || '-'} kcal</div>
                <div className="text-sm text-muted-foreground">Calorías diarias</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-4 bg-background/50 rounded-lg border-2 border-primary/30">
              <TrendingUp className="h-5 w-5 text-primary" />
              <div>
                <div className="text-lg font-bold text-foreground">{plan.proteinas_g || '-'}g</div>
                <div className="text-sm text-muted-foreground">Proteínas</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-4 bg-background/50 rounded-lg border-2 border-primary/30">
              <Activity className="h-5 w-5 text-primary" />
              <div>
                <div className="text-lg font-bold text-foreground">{plan.carbohidratos_g || '-'}g</div>
                <div className="text-sm text-muted-foreground">Carbohidratos</div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-background/50 rounded-lg border-2 border-primary/30">
              <Target className="h-5 w-5 text-primary" />
              <div>
                <div className="text-lg font-bold text-foreground">{plan.grasas_g || '-'}g</div>
                <div className="text-sm text-muted-foreground">Grasas</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Meal Plan */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-foreground">Plan de Comidas</h2>
        
        {Object.entries(MEAL_TYPES).map(([tipo, nombre]) => {
          const comidasTipo = comidas_por_tipo[tipo] || [];
          
          if (comidasTipo.length === 0) {
            return (
              <Card key={tipo} className="bg-card border-border border-2 opacity-60">
                <CardHeader className="py-6">
                  <CardTitle className="text-xl flex items-center justify-between text-foreground">
                    <span className="text-primary">{nombre}</span>
                    <span className="text-lg font-normal text-muted-foreground">Sin comidas asignadas</span>
                  </CardTitle>
                </CardHeader>
              </Card>
            );
          }

          return (
            <Card key={tipo} className="bg-card border-border border-2">
              <CardHeader>
                <CardTitle className="text-xl flex items-center justify-between text-foreground">
                  <span className="text-primary">{nombre}</span>
                  <span className="text-lg font-normal text-muted-foreground">
                    {comidasTipo.length} comida{comidasTipo.length !== 1 ? 's' : ''}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
                  {comidasTipo.map((comida, idx) => (
                    <MealCard key={idx} meal={comida} />
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Summary */}
      <Card className="bg-primary/10 border-primary/30 border-2">
        <CardContent className="p-6">
          <div className="text-center">
            <h3 className="text-xl font-bold text-foreground mb-2">Resumen del Plan</h3>
            <p className="text-muted-foreground text-lg">
              {totalComidas} comidas distribuidas a lo largo del día para alcanzar tus objetivos nutricionales
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
