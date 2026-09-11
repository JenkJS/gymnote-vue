import type { WorkoutExercise, WorkoutSession, WorkoutSet } from './types'

function getActiveExercises(workout: WorkoutSession): WorkoutExercise[] {
  return workout.exercises.filter((exercise) => exercise.deletedAt === null)
}

function getActiveSets(exercise: WorkoutExercise): WorkoutSet[] {
  return exercise.sets.filter((workoutSet) => workoutSet.deletedAt === null)
}

export function calculateExerciseCount(workout: WorkoutSession): number {
  return getActiveExercises(workout).length
}

export function calculateSetCount(workout: WorkoutSession): number {
  return getActiveExercises(workout).reduce(
    (total, exercise) => total + getActiveSets(exercise).length,
    0,
  )
}

export function calculateWorkoutVolume(workout: WorkoutSession): number {
  return getActiveExercises(workout).reduce((workoutTotal, exercise) => {
    const exerciseVolume = getActiveSets(exercise).reduce((exerciseTotal, workoutSet) => {
      if (workoutSet.measurement === 'duration') {
        return exerciseTotal
      }

      return exerciseTotal + workoutSet.weight * workoutSet.repetitions
    }, 0)

    return workoutTotal + exerciseVolume
  }, 0)
}

export function calculateDurationMinutes(workout: WorkoutSession): number {
  if (!workout.completedAt) {
    return 0
  }

  const startedAt = new Date(workout.startedAt).getTime()
  const completedAt = new Date(workout.completedAt).getTime()
  const durationMilliseconds = completedAt - startedAt

  return Math.max(0, Math.round(durationMilliseconds / 60_000))
}
