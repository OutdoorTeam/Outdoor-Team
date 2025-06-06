import * as React from 'react';
import { Checkbox } from '@/components/ui/checkbox';

interface Habit {
  id: number;
  name: string;
  description: string | null;
  points: number;
  completion_id: number | null;
}

interface HabitItemProps {
  habit: Habit;
  onToggle: (habitId: number) => void;
}

export function HabitItem({ habit, onToggle }: HabitItemProps) {
  const isCompleted = habit.completion_id !== null;

  const handleClick = () => {
    onToggle(habit.id);
  };

  return (
    <div 
      className="flex items-center space-x-3 p-4 rounded-lg border-2 border-border hover:bg-muted cursor-pointer transition-all bg-card"
      onClick={handleClick}
    >
      <Checkbox 
        checked={isCompleted}
        readOnly
        className="pointer-events-none data-[state=checked]:bg-primary data-[state=checked]:border-primary"
      />
      <div className="flex-1">
        <h3 className="text-lg font-medium text-foreground">{habit.name}</h3>
        {habit.description && (
          <p className="text-base text-muted-foreground">
            {habit.description}
          </p>
        )}
      </div>
      <div className="text-lg font-bold text-primary">
        +{habit.points}
      </div>
    </div>
  );
}
