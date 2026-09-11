export type TrainingProgramExercise = {
  id: string
  exerciseId: string
  order: number
  targetSets: number
  targetRepetitionsMin: number | null
  targetRepetitionsMax: number | null
  targetDurationSeconds: number | null
}

export type TrainingProgramDay = {
  id: string
  name: string
  order: number
  exercises: TrainingProgramExercise[]
}

export type TrainingProgram = {
  id: string
  name: string
  days: TrainingProgramDay[]
  createdAt: string
  updatedAt: string
  deletedAt: string | null
}
