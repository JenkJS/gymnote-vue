import { gymnoteDatabase } from '@/infrastructure/database/gymnoteDatabase'
import type { WorkoutRepository } from '@/repositories/workoutRepository'
import type { WorkoutSession } from '@/domain/workout/types'

export class DexieWorkoutRepository implements WorkoutRepository {
  async getActiveWorkout(): Promise<WorkoutSession | null> {
    const workout = await gymnoteDatabase.workoutSessions
      .where('status')
      .equals('active')
      .filter((item) => item.deletedAt === null)
      .first()

    return workout ?? null
  }

  async getCompletedWorkouts(): Promise<WorkoutSession[]> {
    const workouts = await gymnoteDatabase.workoutSessions
      .where('status')
      .equals('completed')
      .filter((item) => item.deletedAt === null)
      .toArray()

    return workouts.sort((first, second) => second.startedAt.localeCompare(first.startedAt))
  }

  async saveWorkout(workout: WorkoutSession): Promise<void> {
    await gymnoteDatabase.workoutSessions.put(workout)
  }
}

export const workoutRepository = new DexieWorkoutRepository()
