import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Bell, Plus } from 'lucide-react';

export function HabitSettings() {
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);
  const [eveningReminder, setEveningReminder] = React.useState(true);

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="font-medium">Notificaciones</h3>
        
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="notifications">Recordatorios diarios</Label>
            <p className="text-sm text-muted-foreground">
              Recibe notificaciones para completar tus hábitos
            </p>
          </div>
          <Switch
            id="notifications"
            checked={notificationsEnabled}
            onCheckedChange={setNotificationsEnabled}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="evening">Recordatorio nocturno</Label>
            <p className="text-sm text-muted-foreground">
              Notificación en la noche para anotar puntos
            </p>
          </div>
          <Switch
            id="evening"
            checked={eveningReminder}
            onCheckedChange={setEveningReminder}
          />
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="font-medium">Hábitos Personalizados</h3>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <span className="text-sm">Lectura</span>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <span className="text-sm">Evitar Redes Sociales</span>
            <Switch />
          </div>
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <span className="text-sm">Pausas Activas</span>
            <Switch defaultChecked />
          </div>
        </div>

        <Button variant="outline" className="w-full">
          <Plus className="h-4 w-4 mr-2" />
          Agregar Hábito Personalizado
        </Button>
      </div>
    </div>
  );
}
