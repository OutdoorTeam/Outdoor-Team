import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Upload, FileText, CheckCircle, AlertCircle } from 'lucide-react';

export function PlanImporter() {
  const [file, setFile] = React.useState<File | null>(null);
  const [uploading, setUploading] = React.useState(false);
  const [result, setResult] = React.useState<{ success: boolean; message: string; details?: any } | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type === 'text/csv') {
      setFile(selectedFile);
      setResult(null);
    } else {
      alert('Por favor selecciona un archivo CSV válido');
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append('csvFile', file);

      const response = await fetch('/api/admin/import-plan', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setResult({
          success: true,
          message: 'Plan importado exitosamente',
          details: data
        });
        setFile(null);
        // Reset the file input
        const fileInput = document.getElementById('csvFile') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
      } else {
        throw new Error(data.error || 'Error al importar el plan');
      }
    } catch (error) {
      setResult({
        success: false,
        message: error instanceof Error ? error.message : 'Error desconocido al importar'
      });
    } finally {
      setUploading(false);
    }
  };

  const downloadTemplate = () => {
    const csvContent = `plan_id,alumno_email,dia,ejercicio,series,repeticiones,pausa,intensidad,video_url
1,demo@outdoorteam.com,1,Press de banco inclinado,4,10 RIR 2,60-90s,Moderada,https://youtube.com/watch?v=example1
1,demo@outdoorteam.com,1,Vuelos laterales,4,10,60-90s,Moderada,https://youtube.com/watch?v=example2
1,demo@outdoorteam.com,2,Sentadillas,4,15,45-60s,Moderada,https://youtube.com/watch?v=example3`;
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'plantilla_plan_entrenamiento.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="csvFile" className="text-foreground text-base font-medium">
            Archivo CSV del Plan
          </Label>
          <p className="text-sm text-muted-foreground mb-2">
            Selecciona un archivo CSV con los ejercicios del plan de entrenamiento
          </p>
        </div>
        
        <Input
          id="csvFile"
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          className="bg-input border-border text-foreground file:text-primary file:bg-transparent file:border-0 file:font-medium"
        />

        {file && (
          <div className="flex items-center gap-2 p-3 bg-primary/10 border border-primary/30 rounded-lg">
            <FileText className="h-4 w-4 text-primary" />
            <span className="text-foreground font-medium">{file.name}</span>
            <span className="text-sm text-muted-foreground">({(file.size / 1024).toFixed(1)} KB)</span>
          </div>
        )}

        <div className="flex gap-3">
          <Button
            onClick={handleUpload}
            disabled={!file || uploading}
            className="bg-primary text-primary-foreground hover:bg-primary/90 flex-1"
          >
            <Upload className="h-4 w-4 mr-2" />
            {uploading ? 'Importando...' : 'Importar Plan'}
          </Button>
          
          <Button
            variant="outline"
            onClick={downloadTemplate}
            className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
          >
            <FileText className="h-4 w-4 mr-2" />
            Plantilla CSV
          </Button>
        </div>
      </div>

      {result && (
        <Alert className={`border-2 ${result.success ? 'border-green-600 bg-green-950/20' : 'border-red-600 bg-red-950/20'}`}>
          <div className="flex items-center gap-2">
            {result.success ? (
              <CheckCircle className="h-4 w-4 text-green-400" />
            ) : (
              <AlertCircle className="h-4 w-4 text-red-400" />
            )}
            <AlertDescription className={result.success ? 'text-green-300' : 'text-red-300'}>
              {result.message}
              {result.details && (
                <div className="mt-2 text-sm">
                  <div>Ejercicios procesados: {result.details.exercisesProcessed || 0}</div>
                  <div>Planes actualizados: {result.details.plansUpdated || 0}</div>
                </div>
              )}
            </AlertDescription>
          </div>
        </Alert>
      )}

      <div className="bg-background/50 border border-border rounded-lg p-4">
        <h4 className="font-medium text-foreground mb-2">Formato del archivo CSV:</h4>
        <div className="text-sm text-muted-foreground space-y-1">
          <p><strong>Columnas requeridas:</strong></p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li><code>plan_id</code>: ID del plan de entrenamiento</li>
            <li><code>alumno_email</code>: Email del alumno</li>
            <li><code>dia</code>: Día del entrenamiento (1, 2, 3, 4)</li>
            <li><code>ejercicio</code>: Nombre del ejercicio</li>
            <li><code>series</code>: Número de series</li>
            <li><code>repeticiones</code>: Repeticiones o tiempo</li>
            <li><code>pausa</code>: Tiempo de pausa entre series</li>
            <li><code>intensidad</code>: Nivel de intensidad</li>
            <li><code>video_url</code>: URL del video explicativo (opcional)</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
