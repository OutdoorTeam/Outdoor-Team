import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Settings } from 'lucide-react';
import { useCustomHabits } from '../../hooks/useCustomHabits';

interface AddCustomHabitDialogProps {
  onHabitAdded: () => void;
}

export function AddCustomHabitDialog({ onHabitAdded }: AddCustomHabitDialogProps) {
  const [open, setOpen] = React.useState(false);
  const [name, setName] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [points, setPoints] = React.useState(1);
  const { addCustomHabit, loading } = useCustomHabits();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) return;

    try {
      await addCustomHabit(name.trim(), description.trim(), points);
      setName('');
      setDescription('');
      setPoints(1);
      setOpen(false);
      onHabitAdded();
    } catch (error) {
      console.error('Error adding custom habit:', error);
    }
  };

  const handleCancel = () => {
    setName('');
    setDescription('');
    setPoints(1);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground">
          <Settings className="h-4 w-4 mr-2" />
          Personaliza tu hábito
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-foreground">Personaliza tu hábito</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Crea un nuevo hábito personalizado que se adapte a tus necesidades específicas.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-foreground">Nombre del hábito</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej: Tomar agua, Leer 30 min, Estiramientos"
              required
              className="bg-input border-border text-foreground"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description" className="text-foreground">Descripción (opcional)</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe brevemente tu hábito personalizado..."
              rows={3}
              className="bg-input border-border text-foreground"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="points" className="text-foreground">Puntos por completar</Label>
            <Input
              id="points"
              type="number"
              min="1"
              max="10"
              value={points}
              onChange={(e) => setPoints(parseInt(e.target.value) || 1)}
              className="bg-input border-border text-foreground"
            />
          </div>
          <div className="flex gap-2">
            <Button
              type="submit"
              disabled={loading || !name.trim()}
              className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {loading ? 'Agregando...' : 'Agregar Hábito'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              className="border-border text-foreground hover:bg-muted"
            >
              Cancelar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
