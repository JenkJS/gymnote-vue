import { systemExercises } from '@/domain/exercise/systemExercises'

import { createTrainingProgramsFromFile } from './createTrainingProgramsFromFile'
import type { TrainingProgram } from './types'
import { isTrainingProgramFile } from './validateTrainingProgramFile'

export type TrainingProgramParseResult =
  | {
      ok: true
      programs: TrainingProgram[]
    }
  | {
      ok: false
      reason: 'invalidJson' | 'invalidStructure'
    }
  | {
      ok: false
      reason: 'unknownExercise'
      exerciseId: string
    }

export function parseTrainingProgramFile(fileContent: string): TrainingProgramParseResult {
  let parsedValue: unknown

  try {
    parsedValue = JSON.parse(fileContent)
  } catch {
    return {
      ok: false,
      reason: 'invalidJson',
    }
  }

  if (!isTrainingProgramFile(parsedValue)) {
    return {
      ok: false,
      reason: 'invalidStructure',
    }
  }

  const knownExerciseIds = new Set(systemExercises.map((exercise) => exercise.id))

  for (const program of parsedValue.programs) {
    for (const day of program.days) {
      for (const exercise of day.exercises) {
        if (!knownExerciseIds.has(exercise.exerciseId)) {
          return {
            ok: false,
            reason: 'unknownExercise',
            exerciseId: exercise.exerciseId,
          }
        }
      }
    }
  }

  return {
    ok: true,
    programs: createTrainingProgramsFromFile(parsedValue),
  }
}
