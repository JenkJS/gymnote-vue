import { Dexie, type EntityTable } from 'dexie'

import type { WorkoutSession } from '@/domain/workout/types'
import type { TrainingProgram } from '@/domain/program/types'

export const gymnoteDatabase = new Dexie('GymnoteDatabase') as Dexie & {
  workoutSessions: EntityTable<WorkoutSession, 'id'>
  trainingPrograms: EntityTable<TrainingProgram, 'id'>
}

gymnoteDatabase.version(1).stores({
  workoutSessions: 'id, status, startedAt, completedAt, updatedAt, deletedAt',
})
gymnoteDatabase.version(2).stores({
  workoutSessions: 'id, status, startedAt, completedAt, updatedAt, deletedAt',
  trainingPrograms: 'id, name, updatedAt, deletedAt',
})

gymnoteDatabase
  .version(3)
  .stores({
    workoutSessions: 'id, status, startedAt, completedAt, updatedAt, deletedAt',
    trainingPrograms: 'id, name, updatedAt, deletedAt',
  })
  .upgrade((transaction) => {
    return transaction
      .table<WorkoutSession>('workoutSessions')
      .toCollection()
      .modify((workout) => {
        for (const exercise of workout.exercises) {
          for (const workoutSet of exercise.sets) {
            const storedSet = workoutSet as {
              measurement?: 'weight_repetitions' | 'duration'
            }

            if (storedSet.measurement === undefined) {
              storedSet.measurement = 'weight_repetitions'
            }
          }
        }
      })
  })

gymnoteDatabase
  .version(4)
  .stores({
    workoutSessions: 'id, status, startedAt, completedAt, updatedAt, deletedAt',
    trainingPrograms: 'id, name, updatedAt, deletedAt',
  })
  .upgrade((transaction) => {
    return transaction
      .table<WorkoutSession>('workoutSessions')
      .toCollection()
      .modify((workout) => {
        const storedWorkout = workout as WorkoutSession & {
          source?: WorkoutSession['source']
        }

        storedWorkout.source ??= { type: 'free' }

        for (const exercise of workout.exercises) {
          const storedExercise = exercise as typeof exercise & {
            prescription?: null
          }

          storedExercise.prescription ??= null
        }
      })
  })
