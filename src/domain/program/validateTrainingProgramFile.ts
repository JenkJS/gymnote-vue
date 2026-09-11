import {
  TRAINING_PROGRAM_FILE_FORMAT,
  TRAINING_PROGRAM_FILE_VERSION,
  type TrainingProgramFile,
  type TrainingProgramFileDay,
  type TrainingProgramFileExercise,
  type TrainingProgramFileProgram,
} from './importFormat'

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0
}

function isProgramExercise(value: unknown): value is TrainingProgramFileExercise {
  if (
    !isRecord(value) ||
    !isNonEmptyString(value.exerciseId) ||
    !isPositiveInteger(value.targetSets)
  ) {
    return false
  }

  const repetitionsAreEmpty =
    value.targetRepetitionsMin === null && value.targetRepetitionsMax === null

  const repetitionsAreValid =
    isPositiveInteger(value.targetRepetitionsMin) &&
    isPositiveInteger(value.targetRepetitionsMax) &&
    value.targetRepetitionsMin <= value.targetRepetitionsMax

  const durationIsEmpty = value.targetDurationSeconds === null

  const durationIsValid = isPositiveInteger(value.targetDurationSeconds)

  return (repetitionsAreValid && durationIsEmpty) || (repetitionsAreEmpty && durationIsValid)
}

function isProgramDay(value: unknown): value is TrainingProgramFileDay {
  return (
    isRecord(value) &&
    isNonEmptyString(value.name) &&
    Array.isArray(value.exercises) &&
    value.exercises.length > 0 &&
    value.exercises.every(isProgramExercise)
  )
}

function isProgram(value: unknown): value is TrainingProgramFileProgram {
  return (
    isRecord(value) &&
    isNonEmptyString(value.name) &&
    Array.isArray(value.days) &&
    value.days.length > 0 &&
    value.days.every(isProgramDay)
  )
}

export function isTrainingProgramFile(value: unknown): value is TrainingProgramFile {
  return (
    isRecord(value) &&
    value.format === TRAINING_PROGRAM_FILE_FORMAT &&
    value.version === TRAINING_PROGRAM_FILE_VERSION &&
    Array.isArray(value.programs) &&
    value.programs.length > 0 &&
    value.programs.every(isProgram)
  )
}

function isPositiveInteger(value: unknown): value is number {
  return Number.isInteger(value) && Number(value) > 0
}
