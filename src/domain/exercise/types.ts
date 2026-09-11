export type ExerciseMeasurement = 'weight_repetitions' | 'duration'
export type SystemExercise = {
  id: string
  source: 'system'
  nameKey: string
  measurement: ExerciseMeasurement
}

export type CustomExercise = {
  id: string
  source: 'custom'
  name: string
  originalLanguage: 'en' | 'ru' | null
  measurement: ExerciseMeasurement
  createdAt: string
  updatedAt: string
  deletedAt: string | null
}

export type Exercise = SystemExercise | CustomExercise
