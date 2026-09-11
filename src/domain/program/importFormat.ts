export const TRAINING_PROGRAM_FILE_FORMAT = 'gymnote-training-programs' as const

export const TRAINING_PROGRAM_FILE_VERSION = 1 as const

export type TrainingProgramFileExercise = {
  exerciseId: string
  targetSets: number
  targetRepetitionsMin: number | null
  targetRepetitionsMax: number | null
  targetDurationSeconds: number | null
}
export type TrainingProgramFileDay = {
  name: string
  exercises: TrainingProgramFileExercise[]
}

export type TrainingProgramFileProgram = {
  name: string
  days: TrainingProgramFileDay[]
}

export type TrainingProgramFile = {
  format: typeof TRAINING_PROGRAM_FILE_FORMAT
  version: typeof TRAINING_PROGRAM_FILE_VERSION
  programs: TrainingProgramFileProgram[]
}
