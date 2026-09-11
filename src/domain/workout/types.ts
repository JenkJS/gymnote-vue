export type WorkoutStatus = 'active' | 'completed'

export type WorkoutSource =
  | { type: 'free' }
  | {
      type: 'program'
      programId: string
      programName: string
      dayId: string
      dayName: string
    }

export type WorkoutExercisePrescription = {
  targetSets: number
  targetRepetitionsMin: number | null
  targetRepetitionsMax: number | null
  targetDurationSeconds: number | null
}

type WorkoutSetBase = {
  id: string
  createdAt: string
  updatedAt: string
  deletedAt: string | null
}

export type WeightRepetitionsWorkoutSet = WorkoutSetBase & {
  measurement: 'weight_repetitions'
  weight: number
  repetitions: number
}

export type DurationWorkoutSet = WorkoutSetBase & {
  measurement: 'duration'
  durationSeconds: number
}

export type WorkoutSet = WeightRepetitionsWorkoutSet | DurationWorkoutSet

export type WorkoutExercise = {
  id: string
  exerciseId: string
  order: number
  sets: WorkoutSet[]
  prescription: WorkoutExercisePrescription | null
  createdAt: string
  updatedAt: string
  deletedAt: string | null
}

export type WorkoutSession = {
  id: string
  status: WorkoutStatus
  source: WorkoutSource
  startedAt: string
  completedAt: string | null
  exercises: WorkoutExercise[]
  createdAt: string
  updatedAt: string
  deletedAt: string | null
}
