import * as React from "react";
import { HabitTracker } from "../components/habits/HabitTracker";
import { PointsDisplay } from "../components/habits/PointsDisplay";
import { DailyNotes } from "../components/notes/DailyNotes";
import { StepsCounter } from "../components/steps/StepsCounter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function Dashboard() {
  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Programa Totum</h1>
        <div className="w-full sm:w-auto">
          <PointsDisplay />
        </div>
      </div>

      {/* Steps Counter */}
      <StepsCounter />

      <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
        <Card className="bg-card border-border">
          <CardHeader className="pb-4">
            <CardTitle className="text-foreground text-lg sm:text-xl">¿Cómo te fue hoy?</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <HabitTracker />
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="pb-4">
            <CardTitle className="text-foreground text-lg sm:text-xl">Notas del Día</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <DailyNotes />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
