import type { TrainingProgram } from './types'
import type { TrainingProgramFile } from './importFormat'

export function createTrainingProgramsFromFile(file: TrainingProgramFile): TrainingProgram[] {
  const timestamp = new Date().toISOString()

  return file.programs.map((fileProgram) => ({
    id: crypto.randomUUID(),
    name: fileProgram.name.trim(),

    days: fileProgram.days.map((fileDay, dayIndex) => ({
      id: crypto.randomUUID(),
      name: fileDay.name.trim(),
      order: dayIndex,

      exercises: fileDay.exercises.map((fileExercise, exerciseIndex) => ({
        id: crypto.randomUUID(),
        exerciseId: fileExercise.exerciseId.trim(),
        order: exerciseIndex,
        targetSets: fileExercise.targetSets,
        targetRepetitionsMin: fileExercise.targetRepetitionsMin,
        targetRepetitionsMax: fileExercise.targetRepetitionsMax,
        targetDurationSeconds: fileExercise.targetDurationSeconds,
      })),
    })),

    createdAt: timestamp,
    updatedAt: timestamp,
    deletedAt: null,
  }))
}
