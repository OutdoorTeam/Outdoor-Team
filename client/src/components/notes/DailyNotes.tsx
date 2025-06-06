import * as React from 'react';
import { useDailyNote } from '../../hooks/useDailyNote';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Save } from 'lucide-react';

export function DailyNotes() {
  const { note, loading, saveNote } = useDailyNote();
  const [content, setContent] = React.useState('');
  const [saving, setSaving] = React.useState(false);

  React.useEffect(() => {
    if (note) {
      setContent(note.content);
    }
  }, [note]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await saveNote(content);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-center py-4 text-foreground">Cargando nota...</div>;
  }

  return (
    <div className="space-y-4">
      <Textarea
        placeholder="Escribe tus reflexiones del día, logros, retos, etc..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={8}
        className="resize-none bg-input border-border text-foreground text-lg"
      />
      <Button 
        onClick={handleSave} 
        disabled={saving}
        className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
      >
        <Save className="h-4 w-4 mr-2" />
        {saving ? 'Guardando...' : 'Guardar Nota'}
      </Button>
    </div>
  );
}
