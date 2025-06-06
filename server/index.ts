import express from 'express';
import dotenv from 'dotenv';
import multer from 'multer';
import { setupStaticServing } from './static-serve.js';
import { db } from './database/connection.js';
import { format, startOfWeek, addDays } from 'date-fns';

dotenv.config();

const app = express();

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configure multer for file uploads
const upload = multer({ 
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'text/csv' || file.originalname.endsWith('.csv')) {
      cb(null, true);
    } else {
      cb(new Error('Only CSV files are allowed'));
    }
  }
});

// For demo purposes, we'll use a simple user ID = 1
const DEMO_USER_ID = 1;

// Get user habits and today's completions
app.get('/api/habits/today', async (req, res) => {
  try {
    const today = format(new Date(), 'yyyy-MM-dd');
    console.log('Fetching habits for date:', today);
    
    const userHabits = await db
      .selectFrom('user_habits')
      .innerJoin('habits', 'habits.id', 'user_habits.habit_id')
      .leftJoin('habit_completions', (join) =>
        join
          .onRef('habit_completions.habit_id', '=', 'habits.id')
          .onRef('habit_completions.user_id', '=', 'user_habits.user_id')
          .on('habit_completions.completion_date', '=', today)
      )
      .select([
        'habits.id',
        'habits.name',
        'habits.description',
        'habits.points',
        'habit_completions.id as completion_id'
      ])
      .where('user_habits.user_id', '=', DEMO_USER_ID)
      .where('user_habits.is_active', '=', 1)
      .execute();

    console.log('User habits found:', userHabits.length);
    res.json(userHabits);
  } catch (error) {
    console.error('Error fetching habits:', error);
    res.status(500).json({ error: 'Failed to fetch habits' });
  }
});

// Add custom habit
app.post('/api/habits/custom', async (req, res) => {
  try {
    const { name, description, points } = req.body;
    
    // Insert new habit
    const result = await db
      .insertInto('habits')
      .values({
        name,
        description: description || null,
        points: points || 1,
        is_default: 0
      })
      .returning(['id'])
      .executeTakeFirst();

    if (result) {
      // Associate with user
      await db
        .insertInto('user_habits')
        .values({
          user_id: DEMO_USER_ID,
          habit_id: result.id,
          is_active: 1
        })
        .execute();

      res.json({ success: true, id: result.id });
    } else {
      throw new Error('Failed to create habit');
    }
  } catch (error) {
    console.error('Error creating custom habit:', error);
    res.status(500).json({ error: 'Failed to create custom habit' });
  }
});

// Toggle habit completion
app.post('/api/habits/:habitId/toggle', async (req, res) => {
  try {
    const habitId = parseInt(req.params.habitId);
    const today = format(new Date(), 'yyyy-MM-dd');
    const weekStart = format(startOfWeek(new Date(), { weekStartsOn: 1 }), 'yyyy-MM-dd');
    
    console.log('Toggling habit:', habitId, 'for date:', today);

    // Check if already completed today
    const existing = await db
      .selectFrom('habit_completions')
      .select(['id'])
      .where('user_id', '=', DEMO_USER_ID)
      .where('habit_id', '=', habitId)
      .where('completion_date', '=', today)
      .executeTakeFirst();

    if (existing) {
      // Remove completion
      await db
        .deleteFrom('habit_completions')
        .where('id', '=', existing.id)
        .execute();
      
      console.log('Habit completion removed');
      res.json({ completed: false });
    } else {
      // Get habit points
      const habit = await db
        .selectFrom('habits')
        .select(['points'])
        .where('id', '=', habitId)
        .executeTakeFirst();

      // Add completion
      await db
        .insertInto('habit_completions')
        .values({
          user_id: DEMO_USER_ID,
          habit_id: habitId,
          completion_date: today,
          points_earned: habit?.points || 1
        })
        .execute();
      
      console.log('Habit completion added');
      res.json({ completed: true });
    }

    // Update weekly points
    await updateWeeklyPoints(DEMO_USER_ID, weekStart);
  } catch (error) {
    console.error('Error toggling habit:', error);
    res.status(500).json({ error: 'Failed to toggle habit' });
  }
});

// Helper function to update weekly points
async function updateWeeklyPoints(userId: number, weekStart: string) {
  try {
    const weekEnd = format(addDays(new Date(weekStart), 6), 'yyyy-MM-dd');
    
    const weeklyTotal = await db
      .selectFrom('habit_completions')
      .select([
        db.fn.sum<number>('points_earned').as('total_points')
      ])
      .where('user_id', '=', userId)
      .where('completion_date', '>=', weekStart)
      .where('completion_date', '<=', weekEnd)
      .executeTakeFirst();

    await db
      .insertInto('puntos_semanales')
      .values({
        user_id: userId,
        semana_inicio: weekStart,
        total_puntos: weeklyTotal?.total_points || 0
      })
      .onConflict((oc) => oc
        .columns(['user_id', 'semana_inicio'])
        .doUpdateSet({ 
          total_puntos: weeklyTotal?.total_points || 0,
          updated_at: new Date().toISOString()
        })
      )
      .execute();
  } catch (error) {
    console.error('Error updating weekly points:', error);
  }
}

// Get today's total points and weekly total
app.get('/api/points/today', async (req, res) => {
  try {
    const today = format(new Date(), 'yyyy-MM-dd');
    const weekStart = format(startOfWeek(new Date(), { weekStartsOn: 1 }), 'yyyy-MM-dd');
    
    const dailyResult = await db
      .selectFrom('habit_completions')
      .select([
        db.fn.sum<number>('points_earned').as('total_points'),
        db.fn.count<number>('id').as('completed_habits')
      ])
      .where('user_id', '=', DEMO_USER_ID)
      .where('completion_date', '=', today)
      .executeTakeFirst();

    const weeklyResult = await db
      .selectFrom('puntos_semanales')
      .select(['total_puntos'])
      .where('user_id', '=', DEMO_USER_ID)
      .where('semana_inicio', '=', weekStart)
      .executeTakeFirst();

    res.json({
      total_points: dailyResult?.total_points || 0,
      completed_habits: dailyResult?.completed_habits || 0,
      weekly_points: weeklyResult?.total_puntos || 0
    });
  } catch (error) {
    console.error('Error fetching points:', error);
    res.status(500).json({ error: 'Failed to fetch points' });
  }
});

// Get structured training plan
app.get('/api/plan-entrenamiento', async (req, res) => {
  try {
    // Get student info
    const alumno = await db
      .selectFrom('alumnos')
      .select(['id', 'nombre', 'objetivo', 'plan_asignado'])
      .where('id', '=', DEMO_USER_ID)
      .executeTakeFirst();

    if (!alumno || !alumno.plan_asignado) {
      res.json(null);
      return;
    }

    // Get plan info
    const plan = await db
      .selectFrom('planes_entrenamiento')
      .select(['id', 'nombre', 'objetivo', 'frecuencia', 'pasos_diarios', 'pausas_activas', 'duracion', 'descripcion'])
      .where('id', '=', alumno.plan_asignado)
      .executeTakeFirst();

    if (!plan) {
      res.json(null);
      return;
    }

    // Get exercises grouped by day
    const ejercicios = await db
      .selectFrom('ejercicios_plan')
      .select(['dia', 'ejercicio', 'series', 'repeticiones', 'pausa', 'intensidad', 'video_url', 'orden'])
      .where('plan_id', '=', plan.id)
      .orderBy('dia')
      .orderBy('orden')
      .execute();

    // Group exercises by day
    const ejerciciosPorDia = ejercicios.reduce((acc, ejercicio) => {
      if (!acc[ejercicio.dia]) {
        acc[ejercicio.dia] = [];
      }
      acc[ejercicio.dia].push(ejercicio);
      return acc;
    }, {} as Record<number, typeof ejercicios>);

    res.json({
      plan,
      alumno,
      ejercicios_por_dia: ejerciciosPorDia
    });
  } catch (error) {
    console.error('Error fetching training plan:', error);
    res.status(500).json({ error: 'Failed to fetch training plan' });
  }
});

// Get structured nutrition plan
app.get('/api/plan-nutricion', async (req, res) => {
  try {
    // Get student info
    const alumno = await db
      .selectFrom('alumnos')
      .select(['id', 'nombre', 'objetivo', 'plan_nutricion_asignado'])
      .where('id', '=', DEMO_USER_ID)
      .executeTakeFirst();

    if (!alumno || !alumno.plan_nutricion_asignado) {
      res.json(null);
      return;
    }

    // Get nutrition plan info
    const plan = await db
      .selectFrom('planes_nutricion')
      .select(['id', 'nombre', 'objetivo', 'descripcion', 'calorias_diarias', 'proteinas_g', 'carbohidratos_g', 'grasas_g'])
      .where('id', '=', alumno.plan_nutricion_asignado)
      .executeTakeFirst();

    if (!plan) {
      res.json(null);
      return;
    }

    // Get meals grouped by meal type
    const comidas = await db
      .selectFrom('comidas_plan')
      .select(['tipo_comida', 'nombre_comida', 'ingredientes', 'instrucciones', 'calorias', 'proteinas_g', 'carbohidratos_g', 'grasas_g', 'orden'])
      .where('plan_id', '=', plan.id)
      .orderBy('tipo_comida')
      .orderBy('orden')
      .execute();

    // Group meals by type
    const comidasPorTipo = comidas.reduce((acc, comida) => {
      if (!acc[comida.tipo_comida]) {
        acc[comida.tipo_comida] = [];
      }
      acc[comida.tipo_comida].push(comida);
      return acc;
    }, {} as Record<string, typeof comidas>);

    res.json({
      plan,
      alumno,
      comidas_por_tipo: comidasPorTipo
    });
  } catch (error) {
    console.error('Error fetching nutrition plan:', error);
    res.status(500).json({ error: 'Failed to fetch nutrition plan' });
  }
});

// Get training plan (legacy endpoint)
app.get('/api/training-plan', async (req, res) => {
  try {
    const trainingPlan = await db
      .selectFrom('training_plans')
      .select(['id', 'name', 'description', 'start_date', 'end_date'])
      .where('user_id', '=', DEMO_USER_ID)
      .where('is_active', '=', 1)
      .executeTakeFirst();

    if (!trainingPlan) {
      res.json(null);
      return;
    }

    const exercises = await db
      .selectFrom('training_plan_exercises')
      .innerJoin('exercises', 'exercises.id', 'training_plan_exercises.exercise_id')
      .select([
        'training_plan_exercises.day_of_week',
        'training_plan_exercises.sets',
        'training_plan_exercises.reps',
        'training_plan_exercises.rest_time',
        'training_plan_exercises.notes',
        'exercises.name',
        'exercises.description',
        'exercises.youtube_url',
        'exercises.muscle_groups',
        'exercises.difficulty_level'
      ])
      .where('training_plan_exercises.training_plan_id', '=', trainingPlan.id)
      .orderBy('training_plan_exercises.day_of_week')
      .execute();

    res.json({
      ...trainingPlan,
      exercises
    });
  } catch (error) {
    console.error('Error fetching training plan:', error);
    res.status(500).json({ error: 'Failed to fetch training plan' });
  }
});

// Get daily note
app.get('/api/notes/today', async (req, res) => {
  try {
    const today = format(new Date(), 'yyyy-MM-dd');
    
    const note = await db
      .selectFrom('daily_notes')
      .select(['content'])
      .where('user_id', '=', DEMO_USER_ID)
      .where('note_date', '=', today)
      .executeTakeFirst();

    res.json({ content: note?.content || '' });
  } catch (error) {
    console.error('Error fetching note:', error);
    res.status(500).json({ error: 'Failed to fetch note' });
  }
});

// Save daily note
app.post('/api/notes/today', async (req, res) => {
  try {
    const { content } = req.body;
    const today = format(new Date(), 'yyyy-MM-dd');
    
    await db
      .insertInto('daily_notes')
      .values({
        user_id: DEMO_USER_ID,
        note_date: today,
        content: content || ''
      })
      .onConflict((oc) => oc
        .columns(['user_id', 'note_date'])
        .doUpdateSet({ content: content || '', updated_at: new Date().toISOString() })
      )
      .execute();

    res.json({ success: true });
  } catch (error) {
    console.error('Error saving note:', error);
    res.status(500).json({ error: 'Failed to save note' });
  }
});

// Initialize user habits with defaults
app.post('/api/habits/initialize', async (req, res) => {
  try {
    const defaultHabits = await db
      .selectFrom('habits')
      .select(['id'])
      .where('is_default', '=', 1)
      .execute();

    for (const habit of defaultHabits) {
      await db
        .insertInto('user_habits')
        .values({
          user_id: DEMO_USER_ID,
          habit_id: habit.id,
          is_active: 1
        })
        .onConflict((oc) => oc.columns(['user_id', 'habit_id']).doNothing())
        .execute();
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Error initializing habits:', error);
    res.status(500).json({ error: 'Failed to initialize habits' });
  }
});

// ADMIN ENDPOINTS

// Get all students (admin only)
app.get('/api/admin/students', async (req, res) => {
  try {
    console.log('Fetching students for admin panel');
    
    const students = await db
      .selectFrom('alumnos')
      .select([
        'id',
        'nombre',
        'email',
        'edad',
        'objetivo',
        'plan_asignado',
        'fecha_pago',
        'fecha_vencimiento',
        'puntaje_total',
        'observaciones'
      ])
      .orderBy('nombre')
      .execute();

    console.log('Students found:', students.length);
    res.json(students);
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ error: 'Failed to fetch students' });
  }
});

// Import training plan from CSV (admin only)
app.post('/api/admin/import-plan', upload.single('csvFile'), async (req, res) => {
  try {
    if (!req.file) {
      res.status(400).json({ error: 'No CSV file provided' });
      return;
    }

    console.log('Processing CSV file:', req.file.originalname);
    
    const csvContent = req.file.buffer.toString('utf-8');
    const lines = csvContent.split('\n');
    const headers = lines[0].split(',').map(h => h.trim());
    
    // Validate headers
    const requiredHeaders = ['plan_id', 'alumno_email', 'dia', 'ejercicio', 'series', 'repeticiones', 'pausa', 'intensidad'];
    const missingHeaders = requiredHeaders.filter(h => !headers.includes(h));
    
    if (missingHeaders.length > 0) {
      res.status(400).json({ 
        error: `Missing required headers: ${missingHeaders.join(', ')}` 
      });
      return;
    }

    let exercisesProcessed = 0;
    const plansUpdated = new Set();

    // Process each data row
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      const values = line.split(',').map(v => v.trim());
      if (values.length < requiredHeaders.length) continue;

      const rowData: Record<string, string> = {};
      headers.forEach((header, index) => {
        rowData[header] = values[index] || '';
      });

      try {
        const planId = parseInt(rowData.plan_id);
        const dia = parseInt(rowData.dia);
        const series = rowData.series ? parseInt(rowData.series) : null;
        
        // Verify student exists
        const student = await db
          .selectFrom('alumnos')
          .select(['id'])
          .where('email', '=', rowData.alumno_email)
          .executeTakeFirst();

        if (!student) {
          console.warn(`Student not found for email: ${rowData.alumno_email}`);
          continue;
        }

        // Update student's assigned plan
        await db
          .updateTable('alumnos')
          .set({ plan_asignado: planId })
          .where('email', '=', rowData.alumno_email)
          .execute();

        // Insert or update exercise in plan
        await db
          .insertInto('ejercicios_plan')
          .values({
            plan_id: planId,
            dia: dia,
            ejercicio: rowData.ejercicio,
            series: series,
            repeticiones: rowData.repeticiones || null,
            pausa: rowData.pausa || null,
            intensidad: rowData.intensidad || null,
            video_url: rowData.video_url || null,
            orden: exercisesProcessed + 1
          })
          .execute();

        exercisesProcessed++;
        plansUpdated.add(planId);
        
      } catch (error) {
        console.error(`Error processing row ${i}:`, error);
        continue;
      }
    }

    console.log(`Import completed: ${exercisesProcessed} exercises processed, ${plansUpdated.size} plans updated`);
    
    res.json({
      success: true,
      message: 'Plan imported successfully',
      exercisesProcessed,
      plansUpdated: plansUpdated.size
    });
    
  } catch (error) {
    console.error('Error importing plan:', error);
    res.status(500).json({ error: 'Failed to import plan' });
  }
});

// Export a function to start the server
export async function startServer(port) {
  try {
    if (process.env.NODE_ENV === 'production') {
      setupStaticServing(app);
    }
    app.listen(port, () => {
      console.log(`API Server running on port ${port}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

// Start the server directly if this is the main module
if (import.meta.url === `file://${process.argv[1]}`) {
  console.log('Starting server...');
  startServer(process.env.PORT || 3001);
}
