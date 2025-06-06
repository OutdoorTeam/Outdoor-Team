import * as React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Footprints, Plus, Minus, Target } from 'lucide-react';

export function StepsCounter() {
  const [currentSteps, setCurrentSteps] = React.useState(0);
  const [targetSteps, setTargetSteps] = React.useState(8000);

  const addSteps = (amount: number) => {
    setCurrentSteps(prev => Math.max(0, prev + amount));
  };

  const progress = Math.min((currentSteps / targetSteps) * 100, 100);

  return (
    <Card className="bg-card border-border border-2">
      <CardContent className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-3">
          <div className="flex items-center gap-3">
            <Footprints className="h-6 w-6 sm:h-8 sm:w-8 text-primary flex-shrink-0" />
            <div>
              <h2 className="text-lg sm:text-2xl font-bold text-foreground">Contador de Pasos</h2>
              <p className="text-sm sm:text-base text-muted-foreground">Mantén un registro de tu actividad diaria</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-center sm:text-right">
            <Target className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
            <div>
              <div className="text-base sm:text-lg font-bold text-foreground">{targetSteps.toLocaleString()}</div>
              <div className="text-xs sm:text-sm text-muted-foreground">Meta diaria</div>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xl sm:text-3xl font-bold text-primary">{currentSteps.toLocaleString()}</span>
            <span className="text-sm sm:text-lg text-muted-foreground">{progress.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-muted rounded-full h-3 sm:h-4 overflow-hidden">
            <div 
              className="h-full bg-primary transition-all duration-300 ease-out rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between text-xs sm:text-sm text-muted-foreground mt-1">
            <span>0</span>
            <span>{targetSteps.toLocaleString()} pasos</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-2 sm:gap-4 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={() => addSteps(-500)}
            className="border-primary text-primary hover:bg-primary hover:text-primary-foreground px-2 sm:px-4"
            disabled={currentSteps === 0}
          >
            <Minus className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
            -500
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => addSteps(-100)}
            className="border-primary text-primary hover:bg-primary hover:text-primary-foreground px-2 sm:px-4"
            disabled={currentSteps === 0}
          >
            <Minus className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
            -100
          </Button>

          <div className="mx-2 sm:mx-4 px-3 sm:px-6 py-2 sm:py-3 bg-primary/10 border-2 border-primary/30 rounded-lg">
            <span className="text-lg sm:text-2xl font-bold text-primary">{currentSteps.toLocaleString()}</span>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => addSteps(100)}
            className="border-primary text-primary hover:bg-primary hover:text-primary-foreground px-2 sm:px-4"
          >
            <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
            +100
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => addSteps(500)}
            className="border-primary text-primary hover:bg-primary hover:text-primary-foreground px-2 sm:px-4"
          >
            <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
            +500
          </Button>
        </div>

        {/* Achievement Message */}
        {currentSteps >= targetSteps && (
          <div className="mt-6 p-4 bg-primary/20 border-2 border-primary rounded-lg text-center">
            <p className="text-base sm:text-lg font-bold text-primary">¡Felicidades! 🎉</p>
            <p className="text-sm sm:text-base text-foreground">Has alcanzado tu meta diaria de pasos</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
