<script setup lang="ts">
import { systemExercises } from '@/domain/exercise/systemExercises'
import WorkoutExerciseCard from './WorkoutExerciseCard.vue'
import { useWorkoutSession } from '@/composables/useWorkoutSession'
import WorkoutTimer from './WorkoutTimer.vue'
import WorkoutHistory from './WorkoutHistory.vue'
import TrainingProgramsSection from './TrainingProgramsSection.vue'
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const {
  activeWorkout,
  completedWorkouts,
  isLoading,
  hasLoadError,
  loadWorkouts,
  startWorkout,
  startWorkoutFromProgramDay,
  finishWorkout,
  addExercise,
  addSet,
  addDurationSet,
  removeSet,
  isSaving,
  hasSaveError,
  retrySave,
  updateSet,
  updateDurationSet,
} = useWorkoutSession()
const selectedExerciseId = ref('')

const previousProgramWorkout = computed(() => {
  const source = activeWorkout.value?.source

  if (!source || source.type !== 'program') {
    return null
  }

  return (
    completedWorkouts.value.find(
      (workout) =>
        workout.source.type === 'program' &&
        workout.source.programId === source.programId &&
        workout.source.dayId === source.dayId,
    ) ?? null
  )
})

const selectedExercise = computed(() => {
  return systemExercises.find((exercise) => exercise.id === selectedExerciseId.value) ?? null
})

function addSelectedExercise() {
  if (!selectedExercise.value) {
    return
  }

  addExercise(selectedExercise.value.id)
  selectedExerciseId.value = ''
}

function getExerciseName(exerciseId: string) {
  const exercise = systemExercises.find((item) => item.id === exerciseId)

  return exercise ? t(exercise.nameKey) : exerciseId
}

function getExerciseMeasurement(exerciseId: string) {
  return systemExercises.find((item) => item.id === exerciseId)?.measurement ?? 'weight_repetitions'
}

function getPreviousExercise(exerciseId: string) {
  return (
    previousProgramWorkout.value?.exercises.find(
      (exercise) => exercise.exerciseId === exerciseId && exercise.deletedAt === null,
    ) ?? null
  )
}

function finishActiveWorkout() {
  finishWorkout()
  selectedExerciseId.value = ''
}
</script>

<template>
  <div class="workout-view">
    <TrainingProgramsSection
      :can-start-workout="!activeWorkout"
      @start-program-day="startWorkoutFromProgramDay"
    />

    <p v-if="isLoading" class="workout-state" role="status">{{ t('common.loading') }}</p>
    <div v-else-if="hasLoadError" class="workout-state workout-state--error" role="alert">
      <p>{{ t('workout.errors.load') }}</p>

      <button type="button" @click="loadWorkouts">
        {{ t('common.retry') }}
      </button>
    </div>
    <section v-else class="workout-section" aria-labelledby="workout-title">
      <p v-if="isSaving" class="save-status" role="status">
        {{ t('common.saving') }}
      </p>

      <div v-if="hasSaveError" class="save-status save-status--error" role="alert">
        <span>{{ t('workout.errors.save') }}</span>

        <button type="button" @click="retrySave">
          {{ t('common.retry') }}
        </button>
      </div>
      <div class="workout-section__header">
        <div>
          <h2 id="workout-title" class="workout-section__title">
            {{ activeWorkout ? t('workout.activeTitle') : t('workout.title') }}
          </h2>

          <p class="workout-section__description">
            {{ activeWorkout ? t('workout.activeDescription') : t('workout.noActive') }}
          </p>

          <p v-if="activeWorkout?.source.type === 'program'" class="workout-section__program">
            {{
              t('workout.programDay', {
                program: activeWorkout.source.programName,
                day: activeWorkout.source.dayName,
              })
            }}
          </p>
        </div>

        <button
          v-if="!activeWorkout"
          class="workout-section__action workout-section__action--primary"
          type="button"
          @click="startWorkout"
        >
          {{ t('workout.actions.start') }}
        </button>
        <button
          v-else
          class="workout-section__action workout-section__action--finish"
          type="button"
          @click="finishActiveWorkout"
        >
          {{ t('workout.actions.finish') }}
        </button>
      </div>

      <div v-if="activeWorkout" class="workout-section__active-card">
        <div class="workout-section__status">
          <span class="workout-section__status-dot" aria-hidden="true"></span>
          <span>{{ t('workout.statusActive') }}</span>
        </div>

        <WorkoutTimer :started-at="activeWorkout.startedAt" />
      </div>
      <div v-if="activeWorkout && activeWorkout.exercises.length > 0" class="workout-exercises">
        <h3 class="workout-exercises__title">
          {{ t('exercise.workoutListTitle') }}
        </h3>

        <ul class="workout-exercises__list">
          <WorkoutExerciseCard
            v-for="workoutExercise in activeWorkout.exercises"
            :key="workoutExercise.id"
            :workout-exercise="workoutExercise"
            :previous-exercise="getPreviousExercise(workoutExercise.exerciseId)"
            :exercise-name="getExerciseName(workoutExercise.exerciseId)"
            :exercise-measurement="getExerciseMeasurement(workoutExercise.exerciseId)"
            @add-set="addSet"
            @add-duration-set="addDurationSet"
            @remove-set="removeSet"
            @update-set="updateSet"
            @update-duration-set="updateDurationSet"
          />
        </ul>
      </div>
      <form v-if="activeWorkout" class="exercise-selector" @submit.prevent="addSelectedExercise">
        <label class="exercise-selector__label" for="exercise-select">
          {{ t('exercise.selector.label') }}
        </label>

        <select
          id="exercise-select"
          v-model="selectedExerciseId"
          class="exercise-selector__select"
          name="exerciseId"
        >
          <option value="" disabled>
            {{ t('exercise.selector.placeholder') }}
          </option>

          <option v-for="exercise in systemExercises" :key="exercise.id" :value="exercise.id">
            {{ t(exercise.nameKey) }}
          </option>
        </select>
        <button class="exercise-selector__button" type="submit" :disabled="!selectedExercise">
          {{ t('exercise.selector.add') }}
        </button>
        <p v-if="selectedExercise" class="exercise-selector__result" aria-live="polite">
          {{ t('exercise.selector.selected') }}:
          <strong>{{ t(selectedExercise.nameKey) }}</strong>
        </p>
      </form>
    </section>
    <WorkoutHistory
      v-if="!isLoading && !hasLoadError && completedWorkouts.length > 0"
      :workouts="completedWorkouts"
    />
  </div>
</template>

<style scoped>
.workout-view {
  display: grid;
  gap: 2rem;
}

.workout-state {
  padding: 1.25rem;
  color: var(--color-text-muted);
  text-align: center;
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 1rem;
}

.workout-state--error {
  display: grid;
  justify-items: center;
  gap: 1rem;
  color: var(--color-danger);
}

.workout-state--error p {
  margin: 0;
}

.workout-state--error button {
  min-height: 2.75rem;
  padding-inline: 1rem;
  color: var(--color-text);
  background-color: transparent;
  border: 1px solid var(--color-danger);
  border-radius: 0.625rem;
  cursor: pointer;
}
.workout-section {
  display: grid;
  gap: 1.5rem;
  padding: 1.25rem;
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 1rem;
}

.workout-section__header {
  display: grid;
  gap: 1.25rem;
}

.workout-section__title {
  margin: 0;
  font-size: 1.75rem;
}

.workout-section__description {
  max-width: 36rem;
  margin: 0.5rem 0 0;
  color: var(--color-text-muted);
  line-height: 1.5;
}

.workout-section__program {
  margin: 0.5rem 0 0;
  color: var(--color-accent);
  font-weight: 700;
}

.workout-section__action {
  min-height: 2.75rem;
  padding: 0.75rem 1rem;
  font-weight: 700;
  border-radius: 0.75rem;
  cursor: pointer;
}

.workout-section__action--primary {
  color: var(--color-background);
  background-color: var(--color-accent);
  border: 1px solid var(--color-accent);
}

.workout-section__action--finish {
  color: var(--color-danger);
  background-color: transparent;
  border: 1px solid var(--color-danger);
}

.workout-section__action:focus-visible {
  outline: 3px solid var(--color-accent);
  outline-offset: 3px;
}

@media (hover: hover) {
  .workout-section__action--finish:hover {
    color: var(--color-background);
    background-color: var(--color-danger);
  }
}

.workout-section__active-card {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1rem;
  background-color: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: 0.75rem;
}

.workout-section__status {
  display: flex;
  align-items: center;
  gap: 0.625rem;
}

.workout-section__status-dot {
  width: 0.625rem;
  height: 0.625rem;
  background-color: var(--color-accent);
  border-radius: 50%;
}

.exercise-selector {
  display: grid;
  gap: 0.625rem;
  padding: 1rem;
  text-align: left;
  background-color: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: 0.75rem;
}

.exercise-selector__label {
  font-size: 0.875rem;
  font-weight: 700;
}

.exercise-selector__select {
  width: 100%;
  min-height: 2.75rem;
  padding: 0.75rem;
  color: var(--color-text);
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 0.625rem;
}

.exercise-selector__select:focus-visible {
  outline: 3px solid var(--color-accent);
  outline-offset: 2px;
}

.exercise-selector__result {
  margin: 0.25rem 0 0;
  color: var(--color-text-muted);
}
.exercise-selector__button {
  min-height: 2.75rem;
  padding: 0.75rem 1rem;
  color: var(--color-background);
  font-weight: 700;
  background-color: var(--color-accent);
  border: 0;
  border-radius: 0.625rem;
  cursor: pointer;
}

.exercise-selector__button:disabled {
  cursor: not-allowed;
  opacity: 0.45;
}

.exercise-selector__button:focus-visible {
  outline: 3px solid var(--color-accent);
  outline-offset: 2px;
}

.workout-exercises {
  display: grid;
  gap: 0.75rem;
}

.workout-exercises__title {
  margin: 0;
  font-size: 1rem;
}

.workout-exercises__list {
  display: grid;
  gap: 0.625rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.save-status {
  margin: 0;
  padding: 0.75rem;
  color: var(--color-text-muted);
  text-align: center;
  background-color: var(--color-background);
  border-radius: 0.625rem;
}

.save-status--error {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  color: var(--color-danger);
  border: 1px solid var(--color-danger);
}

.save-status--error button {
  min-height: 2.75rem;
  padding-inline: 0.75rem;
  color: inherit;
  background: transparent;
  border: 1px solid currentColor;
  border-radius: 0.5rem;
  cursor: pointer;
}

@media (min-width: 40rem) {
  .workout-section {
    padding: 2rem;
  }

  .workout-section__header {
    grid-template-columns: 1fr auto;
    align-items: center;
  }
}
</style>
