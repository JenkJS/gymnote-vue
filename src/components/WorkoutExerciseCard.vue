<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'

import type { WorkoutExercise } from '@/domain/workout/types'
import type { ExerciseMeasurement } from '@/domain/exercise/types'

import WorkoutSetRow from './WorkoutSetRow.vue'

const props = defineProps<{
  workoutExercise: WorkoutExercise
  previousExercise: WorkoutExercise | null
  exerciseName: string
  exerciseMeasurement: ExerciseMeasurement
}>()

const emit = defineEmits<{
  addSet: [workoutExerciseId: string, weight: number, repetitions: number]
  updateSet: [workoutExerciseId: string, workoutSetId: string, weight: number, repetitions: number]
  addDurationSet: [workoutExerciseId: string, durationSeconds: number]
  updateDurationSet: [workoutExerciseId: string, workoutSetId: string, durationSeconds: number]
  removeSet: [workoutExerciseId: string, workoutSetId: string]
}>()

const { t } = useI18n()

const weightInput = ref('')
const repetitionsInput = ref('')
const durationInput = ref('')
const visibleSets = computed(() => {
  return props.workoutExercise.sets.filter((workoutSet) => workoutSet.deletedAt === null)
})
const previousSets = computed(() => {
  return props.previousExercise?.sets.filter((workoutSet) => workoutSet.deletedAt === null) ?? []
})

const prescriptionText = computed(() => {
  const prescription = props.workoutExercise.prescription

  if (!prescription) {
    return ''
  }

  if (prescription.targetDurationSeconds !== null) {
    return t('workout.prescription.duration', {
      sets: prescription.targetSets,
      seconds: prescription.targetDurationSeconds,
    })
  }

  if (prescription.targetRepetitionsMin !== null && prescription.targetRepetitionsMax !== null) {
    if (prescription.targetRepetitionsMin === prescription.targetRepetitionsMax) {
      return t('workout.prescription.repetitions', {
        sets: prescription.targetSets,
        repetitions: prescription.targetRepetitionsMin,
      })
    }

    return t('workout.prescription.repetitionsRange', {
      sets: prescription.targetSets,
      min: prescription.targetRepetitionsMin,
      max: prescription.targetRepetitionsMax,
    })
  }

  return ''
})

function submitSet() {
  const weight = Number.parseFloat(weightInput.value)
  const repetitions = Number.parseInt(repetitionsInput.value, 10)

  if (!Number.isFinite(weight) || weight < 0 || !Number.isInteger(repetitions) || repetitions < 1) {
    return
  }

  emit('addSet', props.workoutExercise.id, weight, repetitions)

  repetitionsInput.value = ''
}

function submitDurationSet() {
  const durationSeconds = Number.parseInt(durationInput.value, 10)

  if (!Number.isInteger(durationSeconds) || durationSeconds < 1) {
    return
  }

  emit('addDurationSet', props.workoutExercise.id, durationSeconds)
  durationInput.value = ''
}
function forwardSetUpdate(workoutSetId: string, weight: number, repetitions: number) {
  emit('updateSet', props.workoutExercise.id, workoutSetId, weight, repetitions)
}

function forwardSetRemoval(workoutSetId: string) {
  emit('removeSet', props.workoutExercise.id, workoutSetId)
}

function forwardDurationSetUpdate(workoutSetId: string, durationSeconds: number) {
  emit('updateDurationSet', props.workoutExercise.id, workoutSetId, durationSeconds)
}
</script>

<template>
  <li class="exercise-card">
    <h4 class="exercise-card__title">
      {{ exerciseName }}
    </h4>

    <p v-if="prescriptionText" class="exercise-card__prescription">
      {{ prescriptionText }}
    </p>

    <aside v-if="previousSets.length > 0" class="previous-result">
      <p class="previous-result__title">{{ t('workout.previousResult') }}</p>

      <ol class="previous-result__sets">
        <li v-for="(workoutSet, index) in previousSets" :key="workoutSet.id">
          <span>{{ index + 1 }}</span>
          <template v-if="workoutSet.measurement === 'weight_repetitions'">
            {{ workoutSet.weight }} {{ t('workoutSet.weightUnit') }} × {{ workoutSet.repetitions }}
            {{ t('workoutSet.repetitionsUnit') }}
          </template>
          <template v-else>
            {{ workoutSet.durationSeconds }} {{ t('workoutSet.durationUnit') }}
          </template>
        </li>
      </ol>
    </aside>

    <form
      v-if="exerciseMeasurement === 'weight_repetitions'"
      class="set-form"
      @submit.prevent="submitSet"
    >
      <label class="set-form__field">
        <span>{{ t('workoutSet.weightLabel') }}</span>

        <input
          v-model="weightInput"
          name="weight"
          type="number"
          inputmode="decimal"
          min="0"
          step="0.5"
          required
        />
      </label>

      <label class="set-form__field">
        <span>{{ t('workoutSet.repetitionsLabel') }}</span>

        <input
          v-model="repetitionsInput"
          name="repetitions"
          type="number"
          inputmode="numeric"
          min="1"
          step="1"
          required
        />
      </label>

      <button class="set-form__button" type="submit">
        {{ t('workoutSet.add') }}
      </button>
    </form>

    <form v-else class="set-form set-form--duration" @submit.prevent="submitDurationSet">
      <label class="set-form__field">
        <span>{{ t('workoutSet.durationLabel') }}</span>

        <input
          v-model="durationInput"
          name="durationSeconds"
          type="number"
          inputmode="numeric"
          min="1"
          step="1"
          required
        />
      </label>

      <button class="set-form__button" type="submit">
        {{ t('workoutSet.add') }}
      </button>
    </form>

    <div class="set-list">
      <h5 class="set-list__title">
        {{ t('workoutSet.title') }}
      </h5>

      <p v-if="visibleSets.length === 0" class="set-list__empty">
        {{ t('workoutSet.empty') }}
      </p>

      <ol v-else class="set-list__items">
        <WorkoutSetRow
          v-for="(workoutSet, index) in visibleSets"
          :key="workoutSet.id"
          :workout-set="workoutSet"
          :index="index"
          @update-set="forwardSetUpdate"
          @update-duration-set="forwardDurationSetUpdate"
          @remove-set="forwardSetRemoval"
        />
      </ol>
    </div>
  </li>
</template>
<style scoped>
.exercise-card {
  display: grid;
  gap: 1.25rem;
  padding: 1rem;
  text-align: left;
  background-color: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: 0.75rem;
}

.exercise-card__title {
  margin: 0;
  font-size: 1.125rem;
}

.exercise-card__prescription {
  margin: -0.75rem 0 0;
  color: var(--color-accent);
  font-size: 0.875rem;
  font-weight: 700;
}

.previous-result {
  display: grid;
  gap: 0.5rem;
  padding: 0.75rem;
  background-color: var(--color-surface);
  border-left: 3px solid var(--color-accent);
  border-radius: 0.5rem;
}

.previous-result__title {
  margin: 0;
  color: var(--color-text-muted);
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.previous-result__sets {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  padding: 0;
  margin: 0;
  list-style: none;
}

.previous-result__sets li {
  padding: 0.375rem 0.625rem;
  font-size: 0.875rem;
  font-weight: 700;
  background-color: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: 999px;
}

.previous-result__sets li > span {
  margin-right: 0.25rem;
  color: var(--color-accent);
}

.set-form {
  display: grid;
  gap: 0.75rem;
}

.set-form--duration {
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: end;
}

.set-form__field {
  display: grid;
  gap: 0.375rem;
  color: var(--color-text-muted);
  font-size: 0.875rem;
  font-weight: 700;
}

.set-form__field input {
  width: 100%;
  min-height: 2.75rem;
  padding: 0.75rem;
  color: var(--color-text);
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 0.625rem;
}

.set-form__field input:focus-visible,
.set-form__button:focus-visible {
  outline: 3px solid var(--color-accent);
  outline-offset: 2px;
}

.set-form__button {
  min-height: 2.75rem;
  padding: 0.75rem 1rem;
  color: var(--color-background);
  font-weight: 700;
  background-color: var(--color-accent);
  border: 0;
  border-radius: 0.625rem;
  cursor: pointer;
}

.set-list {
  display: grid;
  gap: 0.625rem;
}

.set-list__title,
.set-list__empty {
  margin: 0;
}

.set-list__empty {
  color: var(--color-text-muted);
}

.set-list__items {
  display: grid;
  gap: 0.5rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.set-list__item {
  display: grid;
  grid-template-columns: 2rem minmax(0, 1fr) auto;
  align-items: center;
  gap: 0.5rem;
  min-height: 2.75rem;
  padding: 0.5rem;
  background-color: var(--color-surface);
  border-radius: 0.5rem;
}

.set-list__metrics {
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem;
}

.set-list__remove-button {
  min-height: 2.75rem;
  padding-inline: 0.75rem;
  color: var(--color-danger);
  background-color: transparent;
  border: 1px solid var(--color-border);
  border-radius: 0.5rem;
  cursor: pointer;
}

.set-list__remove-button:focus-visible {
  outline: 3px solid var(--color-accent);
  outline-offset: 2px;
}

.set-list__number {
  display: grid;
  place-items: center;
  width: 1.75rem;
  height: 1.75rem;
  color: var(--color-background);
  font-weight: 700;
  background-color: var(--color-accent);
  border-radius: 50%;
}

@media (min-width: 40rem) {
  .set-form {
    grid-template-columns: 1fr 1fr auto;
    align-items: end;
  }

  .set-form--duration {
    grid-template-columns: minmax(0, 1fr) auto;
  }
}
</style>
