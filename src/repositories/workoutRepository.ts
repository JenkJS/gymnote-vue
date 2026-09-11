import type { WorkoutSession } from '@/domain/workout/types'

export interface WorkoutRepository {
  getActiveWorkout(): Promise<WorkoutSession | null>

  getCompletedWorkouts(): Promise<WorkoutSession[]>

  saveWorkout(workout: WorkoutSession): Promise<void>
}
