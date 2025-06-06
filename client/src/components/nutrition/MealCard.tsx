import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Utensils, Clock, ChefHat } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface Meal {
  nombre_comida: string;
  ingredientes: string | null;
  instrucciones: string | null;
  calorias: number | null;
  proteinas_g: number | null;
  carbohidratos_g: number | null;
  grasas_g: number | null;
}

interface MealCardProps {
  meal: Meal;
}

export function MealCard({ meal }: MealCardProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  const getTotalMacros = () => {
    const proteinas = meal.proteinas_g || 0;
    const carbos = meal.carbohidratos_g || 0;
    const grasas = meal.grasas_g || 0;
    return proteinas + carbos + grasas;
  };

  const getMacroPercentage = (macro: number) => {
    const total = getTotalMacros();
    return total > 0 ? Math.round((macro / total) * 100) : 0;
  };

  return (
    <Card className="h-full bg-card border-border">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg flex items-center gap-2 text-foreground">
            <ChefHat className="h-5 w-5 text-primary" />
            {meal.nombre_comida}
          </CardTitle>
          {meal.calorias && (
            <Badge className="bg-primary text-primary-foreground font-bold">
              {meal.calorias} kcal
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="pt-0 space-y-4">
        {/* Macronutrientes */}
        {(meal.proteinas_g || meal.carbohidratos_g || meal.grasas_g) && (
          <div className="bg-background/80 rounded-lg p-4 border border-border">
            <h4 className="font-medium text-lg mb-3 text-center text-foreground">Macronutrientes</h4>
            <div className="grid grid-cols-3 gap-3">
              <div className="text-center">
                <div className="bg-card rounded-lg p-3 border-2 border-blue-500/50">
                  <div className="text-lg font-bold text-blue-400">
                    {meal.proteinas_g || 0}g
                  </div>
                  <div className="text-xs text-muted-foreground font-medium">
                    Proteínas
                  </div>
                  <div className="text-xs text-blue-400 font-medium">
                    {getMacroPercentage(meal.proteinas_g || 0)}%
                  </div>
                </div>
              </div>
              
              <div className="text-center">
                <div className="bg-card rounded-lg p-3 border-2 border-green-500/50">
                  <div className="text-lg font-bold text-green-400">
                    {meal.carbohidratos_g || 0}g
                  </div>
                  <div className="text-xs text-muted-foreground font-medium">
                    Carbohidratos
                  </div>
                  <div className="text-xs text-green-400 font-medium">
                    {getMacroPercentage(meal.carbohidratos_g || 0)}%
                  </div>
                </div>
              </div>
              
              <div className="text-center">
                <div className="bg-card rounded-lg p-3 border-2 border-yellow-500/50">
                  <div className="text-lg font-bold text-yellow-400">
                    {meal.grasas_g || 0}g
                  </div>
                  <div className="text-xs text-muted-foreground font-medium">
                    Grasas
                  </div>
                  <div className="text-xs text-yellow-400 font-medium">
                    {getMacroPercentage(meal.grasas_g || 0)}%
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Ingredientes e Instrucciones (Colapsible) */}
        {(meal.ingredientes || meal.instrucciones) && (
          <Collapsible open={isOpen} onOpenChange={setIsOpen}>
            <CollapsibleTrigger asChild>
              <Button 
                variant="outline" 
                className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground flex items-center justify-between"
              >
                <span className="flex items-center gap-2">
                  <Utensils className="h-4 w-4" />
                  Ver detalles
                </span>
                {isOpen ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>
            </CollapsibleTrigger>
            
            <CollapsibleContent className="space-y-3 mt-3">
              {meal.ingredientes && (
                <div className="space-y-2">
                  <h5 className="font-medium text-sm text-foreground flex items-center gap-2">
                    <Clock className="h-4 w-4 text-primary" />
                    Ingredientes:
                  </h5>
                  <div className="p-3 bg-blue-950/20 border border-blue-600/50 rounded-lg">
                    <p className="text-sm text-blue-300 whitespace-pre-line">{meal.ingredientes}</p>
                  </div>
                </div>
              )}

              {meal.instrucciones && (
                <div className="space-y-2">
                  <h5 className="font-medium text-sm text-foreground flex items-center gap-2">
                    <ChefHat className="h-4 w-4 text-primary" />
                    Preparación:
                  </h5>
                  <div className="p-3 bg-green-950/20 border border-green-600/50 rounded-lg">
                    <p className="text-sm text-green-300 whitespace-pre-line">{meal.instrucciones}</p>
                  </div>
                </div>
              )}
            </CollapsibleContent>
          </Collapsible>
        )}
      </CardContent>
    </Card>
  );
}
