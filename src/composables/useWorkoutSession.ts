import { onMounted, ref, toRaw } from 'vue'

import { workoutRepository } from '@/infrastructure/repositories/DexieWorkoutRepository'
import type { WorkoutRepository } from '@/repositories/workoutRepository'
import type { WorkoutSession } from '@/domain/workout/types'
import type { TrainingProgram, TrainingProgramDay } from '@/domain/program/types'

export function useWorkoutSession(repository: WorkoutRepository = workoutRepository) {
  const isLoading = ref(true)
  const hasLoadError = ref(false)
  const isSaving = ref(false)
  const hasSaveError = ref(false)
  const activeWorkout = ref<WorkoutSession | null>(null)
  const completedWorkouts = ref<WorkoutSession[]>([])

  async function loadWorkouts() {
    isLoading.value = true
    hasLoadError.value = false

    try {
      const [storedActiveWorkout, storedCompletedWorkouts] = await Promise.all([
        repository.getActiveWorkout(),
        repository.getCompletedWorkouts(),
      ])

      activeWorkout.value = storedActiveWorkout

      completedWorkouts.value = storedCompletedWorkouts
    } catch {
      hasLoadError.value = true
    } finally {
      isLoading.value = false
    }
  }

  async function startWorkout() {
    const timestamp = new Date().toISOString()

    activeWorkout.value = {
      id: crypto.randomUUID(),
      status: 'active',
      source: { type: 'free' },
      startedAt: timestamp,
      completedAt: null,
      exercises: [],
      createdAt: timestamp,
      updatedAt: timestamp,
      deletedAt: null,
    }
    await persistWorkout(activeWorkout.value)
  }
  async function retrySave() {
    if (activeWorkout.value) {
      await persistWorkout(activeWorkout.value)
    }
  }

  async function finishWorkout() {
    if (!activeWorkout.value) {
      return
    }

    const completedWorkout = createWorkoutSnapshot(activeWorkout.value)

    const timestamp = new Date().toISOString()

    completedWorkout.status = 'completed'
    completedWorkout.completedAt = timestamp
    completedWorkout.updatedAt = timestamp

    const wasSaved = await persistWorkout(completedWorkout)

    if (!wasSaved) {
      return
    }

    completedWorkouts.value.unshift(completedWorkout)
    activeWorkout.value = null
  }

  async function addExercise(exerciseId: string) {
    if (!activeWorkout.value) {
      return
    }

    const timestamp = new Date().toISOString()

    activeWorkout.value.exercises.push({
      id: crypto.randomUUID(),
      exerciseId,
      order: activeWorkout.value.exercises.length,
      sets: [],
      prescription: null,
      createdAt: timestamp,
      updatedAt: timestamp,
      deletedAt: null,
    })

    activeWorkout.value.updatedAt = timestamp
    await persistWorkout(activeWorkout.value)
  }

  async function startWorkoutFromProgramDay(
    program: TrainingProgram,
    day: TrainingProgramDay,
  ): Promise<boolean> {
    if (activeWorkout.value) {
      return false
    }

    const timestamp = new Date().toISOString()
    const sortedExercises = [...day.exercises].sort((first, second) => first.order - second.order)

    activeWorkout.value = {
      id: crypto.randomUUID(),
      status: 'active',
      source: {
        type: 'program',
        programId: program.id,
        programName: program.name,
        dayId: day.id,
        dayName: day.name,
      },
      startedAt: timestamp,
      completedAt: null,
      exercises: sortedExercises.map((exercise, index) => ({
        id: crypto.randomUUID(),
        exerciseId: exercise.exerciseId,
        order: index,
        sets: [],
        prescription: {
          targetSets: exercise.targetSets,
          targetRepetitionsMin: exercise.targetRepetitionsMin,
          targetRepetitionsMax: exercise.targetRepetitionsMax,
          targetDurationSeconds: exercise.targetDurationSeconds,
        },
        createdAt: timestamp,
        updatedAt: timestamp,
        deletedAt: null,
      })),
      createdAt: timestamp,
      updatedAt: timestamp,
      deletedAt: null,
    }

    return persistWorkout(activeWorkout.value)
  }
  async function addSet(workoutExerciseId: string, weight: number, repetitions: number) {
    if (!activeWorkout.value) {
      return
    }

    const workoutExercise = activeWorkout.value.exercises.find(
      (exercise) => exercise.id === workoutExerciseId,
    )

    if (!workoutExercise) {
      return
    }

    const timestamp = new Date().toISOString()

    workoutExercise.sets.push({
      id: crypto.randomUUID(),
      measurement: 'weight_repetitions',
      weight,
      repetitions,
      createdAt: timestamp,
      updatedAt: timestamp,
      deletedAt: null,
    })

    workoutExercise.updatedAt = timestamp
    activeWorkout.value.updatedAt = timestamp
    await persistWorkout(activeWorkout.value)
  }

  async function updateSet(
    workoutExerciseId: string,
    workoutSetId: string,
    weight: number,
    repetitions: number,
  ) {
    if (!activeWorkout.value) {
      return
    }

    const workoutExercise = activeWorkout.value.exercises.find(
      (exercise) => exercise.id === workoutExerciseId,
    )

    const workoutSet = workoutExercise?.sets.find((set) => set.id === workoutSetId)

    if (
      !workoutExercise ||
      !workoutSet ||
      workoutSet.deletedAt ||
      workoutSet.measurement !== 'weight_repetitions'
    ) {
      return
    }

    const timestamp = new Date().toISOString()

    workoutSet.weight = weight
    workoutSet.repetitions = repetitions
    workoutSet.updatedAt = timestamp
    workoutExercise.updatedAt = timestamp
    activeWorkout.value.updatedAt = timestamp

    await persistWorkout(activeWorkout.value)
  }

  async function addDurationSet(workoutExerciseId: string, durationSeconds: number) {
    if (!activeWorkout.value || !Number.isInteger(durationSeconds) || durationSeconds < 1) {
      return
    }

    const workoutExercise = activeWorkout.value.exercises.find(
      (exercise) => exercise.id === workoutExerciseId,
    )

    if (!workoutExercise) {
      return
    }

    const timestamp = new Date().toISOString()

    workoutExercise.sets.push({
      id: crypto.randomUUID(),
      measurement: 'duration',
      durationSeconds,
      createdAt: timestamp,
      updatedAt: timestamp,
      deletedAt: null,
    })

    workoutExercise.updatedAt = timestamp
    activeWorkout.value.updatedAt = timestamp
    await persistWorkout(activeWorkout.value)
  }

  async function updateDurationSet(
    workoutExerciseId: string,
    workoutSetId: string,
    durationSeconds: number,
  ) {
    if (!activeWorkout.value || !Number.isInteger(durationSeconds) || durationSeconds < 1) {
      return
    }

    const workoutExercise = activeWorkout.value.exercises.find(
      (exercise) => exercise.id === workoutExerciseId,
    )
    const workoutSet = workoutExercise?.sets.find((set) => set.id === workoutSetId)

    if (
      !workoutExercise ||
      !workoutSet ||
      workoutSet.deletedAt ||
      workoutSet.measurement !== 'duration'
    ) {
      return
    }

    const timestamp = new Date().toISOString()

    workoutSet.durationSeconds = durationSeconds
    workoutSet.updatedAt = timestamp
    workoutExercise.updatedAt = timestamp
    activeWorkout.value.updatedAt = timestamp
    await persistWorkout(activeWorkout.value)
  }

  async function removeSet(workoutExerciseId: string, workoutSetId: string) {
    if (!activeWorkout.value) {
      return
    }

    const workoutExercise = activeWorkout.value.exercises.find(
      (exercise) => exercise.id === workoutExerciseId,
    )

    const workoutSet = workoutExercise?.sets.find((set) => set.id === workoutSetId)

    if (!workoutExercise || !workoutSet || workoutSet.deletedAt) {
      return
    }

    const timestamp = new Date().toISOString()

    workoutSet.deletedAt = timestamp
    workoutSet.updatedAt = timestamp
    workoutExercise.updatedAt = timestamp
    activeWorkout.value.updatedAt = timestamp
    await persistWorkout(activeWorkout.value)
  }

  function createWorkoutSnapshot(workout: WorkoutSession): WorkoutSession {
    return structuredClone(toRaw(workout))
  }
  async function persistWorkout(workout: WorkoutSession): Promise<boolean> {
    isSaving.value = true
    hasSaveError.value = false

    try {
      const snapshot = createWorkoutSnapshot(workout)

      await repository.saveWorkout(snapshot)

      return true
    } catch {
      hasSaveError.value = true

      return false
    } finally {
      isSaving.value = false
    }
  }
  onMounted(() => {
    void loadWorkouts()
  })

  return {
    activeWorkout,
    completedWorkouts,
    startWorkout,
    startWorkoutFromProgramDay,
    finishWorkout,
    addExercise,
    addSet,
    addDurationSet,
    removeSet,
    isLoading,
    hasLoadError,
    loadWorkouts,
    isSaving,
    hasSaveError,
    retrySave,
    updateSet,
    updateDurationSet,
  }
}
