import * as React from 'react';
import { useHabits } from '../../hooks/useHabits';
import { HabitItem } from './HabitItem';
import { AddCustomHabitDialog } from './AddCustomHabitDialog';
import { Button } from '@/components/ui/button';

export function HabitTracker() {
  const { habits, loading, error, toggleHabit, initializeHabits, refetch } = useHabits();

  React.useEffect(() => {
    initializeHabits();
  }, [initializeHabits]);

  const handleHabitAdded = () => {
    refetch();
  };

  if (loading) {
    return <div className="text-center py-4 text-foreground">Cargando hábitos...</div>;
  }

  if (error) {
    return <div className="text-center py-4 text-destructive">Error: {error}</div>;
  }

  // Separar hábitos por defecto y personalizados
  const defaultHabits = habits.filter(habit => ['Alimentación', 'Cantidad de pasos', 'Entrenamiento del día', 'Meditación'].includes(habit.name));
  const customHabits = habits.filter(habit => !['Alimentación', 'Cantidad de pasos', 'Entrenamiento del día', 'Meditación'].includes(habit.name));

  if (habits.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground mb-4">No tienes hábitos configurados</p>
        <div className="space-y-3">
          <Button 
            onClick={initializeHabits}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Configurar Hábitos por Defecto
          </Button>
          <AddCustomHabitDialog onHabitAdded={handleHabitAdded} />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        {/* Hábitos por defecto */}
        {defaultHabits.map((habit) => (
          <HabitItem
            key={habit.id}
            habit={habit}
            onToggle={toggleHabit}
          />
        ))}
        
        {/* Hábitos personalizados */}
        {customHabits.map((habit) => (
          <HabitItem
            key={habit.id}
            habit={habit}
            onToggle={toggleHabit}
          />
        ))}
      </div>
      
      {/* Botón para personalizar hábito */}
      <div className="pt-2 border-t border-border">
        <AddCustomHabitDialog onHabitAdded={handleHabitAdded} />
      </div>
    </div>
  );
}
