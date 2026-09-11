<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import type { WorkoutSet } from '../domain/workout/types'

const props = defineProps<{
  workoutSet: WorkoutSet
  index: number
}>()

const emit = defineEmits<{
  updateSet: [workoutSetId: string, weight: number, repetitions: number]
  updateDurationSet: [workoutSetId: string, durationSeconds: number]
  removeSet: [workoutSetId: string]
}>()

const { t } = useI18n()

const isEditing = ref(false)
const weightInput = ref('')
const repetitionsInput = ref('')
const durationInput = ref('')

function startEditing() {
  if (props.workoutSet.measurement === 'duration') {
    durationInput.value = String(props.workoutSet.durationSeconds)
  } else {
    weightInput.value = String(props.workoutSet.weight)
    repetitionsInput.value = String(props.workoutSet.repetitions)
  }

  isEditing.value = true
}

function cancelEditing() {
  isEditing.value = false
}

function submitEdit() {
  if (props.workoutSet.measurement === 'duration') {
    const durationSeconds = Number.parseInt(durationInput.value, 10)

    if (!Number.isInteger(durationSeconds) || durationSeconds < 1) {
      return
    }

    emit('updateDurationSet', props.workoutSet.id, durationSeconds)
    isEditing.value = false
    return
  }

  const weight = Number.parseFloat(weightInput.value)
  const repetitions = Number.parseInt(repetitionsInput.value, 10)

  if (
    !Number.isFinite(weight) ||
    weight < 0 ||
    !Number.isInteger(repetitions) ||
    repetitions <= 0
  ) {
    return
  }

  emit('updateSet', props.workoutSet.id, weight, repetitions)
  isEditing.value = false
}

function requestRemoval() {
  emit('removeSet', props.workoutSet.id)
}
</script>
<template>
  <li class="set-row">
    <template v-if="isEditing && workoutSet.measurement === 'weight_repetitions'">
      <form class="set-row__form" @submit.prevent="submitEdit">
        <label class="set-row__field">
          <span>{{ t('workoutSet.weightLabel') }}</span>

          <input
            v-model="weightInput"
            name="weight"
            type="number"
            min="0"
            step="0.5"
            inputmode="decimal"
            required
          />
        </label>

        <label class="set-row__field">
          <span>{{ t('workoutSet.repetitionsLabel') }}</span>

          <input
            v-model="repetitionsInput"
            name="repetitions"
            type="number"
            min="1"
            step="1"
            inputmode="numeric"
            required
          />
        </label>

        <div class="set-row__actions">
          <button class="set-row__save" type="submit">
            {{ t('workoutSet.save') }}
          </button>

          <button class="set-row__cancel" type="button" @click="cancelEditing">
            {{ t('workoutSet.cancel') }}
          </button>
        </div>
      </form>
    </template>

    <template v-else-if="isEditing">
      <form class="set-row__form set-row__form--duration" @submit.prevent="submitEdit">
        <label class="set-row__field">
          <span>{{ t('workoutSet.durationLabel') }}</span>

          <input
            v-model="durationInput"
            name="durationSeconds"
            type="number"
            min="1"
            step="1"
            inputmode="numeric"
            required
          />
        </label>

        <div class="set-row__actions">
          <button class="set-row__save" type="submit">
            {{ t('workoutSet.save') }}
          </button>

          <button class="set-row__cancel" type="button" @click="cancelEditing">
            {{ t('workoutSet.cancel') }}
          </button>
        </div>
      </form>
    </template>

    <template v-else>
      <div class="set-row__summary">
        <span class="set-row__number">{{ index + 1 }}</span>

        <span v-if="workoutSet.measurement === 'weight_repetitions'">
          {{ workoutSet.weight }} {{ t('workoutSet.weightUnit') }} {{ workoutSet.repetitions }}
          {{ t('workoutSet.repetitionsUnit') }}
        </span>
        <span v-else> {{ workoutSet.durationSeconds }} {{ t('workoutSet.durationUnit') }} </span>
      </div>

      <div class="set-row__actions">
        <button
          class="set-row__edit"
          type="button"
          :aria-label="t('workoutSet.editAriaLabel', { number: index + 1 })"
          @click="startEditing"
        >
          {{ t('workoutSet.edit') }}
        </button>

        <button
          class="set-row__remove"
          type="button"
          :aria-label="t('workoutSet.removeAriaLabel', { number: index + 1 })"
          @click="requestRemoval"
        >
          {{ t('workoutSet.remove') }}
        </button>
      </div>
    </template>
  </li>
</template>
<style scoped>
.set-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 12px;
  border-radius: 10px;
  background: #191a1d;
}

.set-row__summary {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
  font-weight: 700;
}

.set-row__number {
  display: grid;
  flex: 0 0 36px;
  width: 36px;
  height: 36px;
  place-items: center;
  border-radius: 50%;
  color: #111;
  background: #b7f83e;
}

.set-row__actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.set-row__actions button {
  min-height: 44px;
  padding: 0 16px;
  border: 1px solid #303238;
  border-radius: 9px;
  font: inherit;
  font-weight: 700;
  cursor: pointer;
}

.set-row__edit,
.set-row__cancel {
  color: #f5f5f5;
  background: transparent;
}

.set-row__remove {
  color: #ff6b6b;
  background: transparent;
}

.set-row__save {
  color: #111;
  background: #b7f83e;
}

.set-row__form {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr) auto;
  align-items: end;
  gap: 12px;
  width: 100%;
}

.set-row__form--duration {
  grid-template-columns: minmax(0, 1fr) auto;
}

.set-row__field {
  display: grid;
  gap: 6px;
  color: #a5a5aa;
  font-weight: 700;
}

.set-row__field input {
  width: 100%;
  min-height: 44px;
  padding: 0 12px;
  border: 1px solid #303238;
  border-radius: 9px;
  color: #f5f5f5;
  background: #1d1e22;
  font: inherit;
}

.set-row__field input:focus-visible,
.set-row__actions button:focus-visible {
  outline: 3px solid rgb(183 248 62 / 35%);
  outline-offset: 2px;
}

@media (hover: hover) {
  .set-row__actions button:hover {
    border-color: #6b6e75;
  }

  .set-row__save:hover {
    background: #c4ff54;
  }
}

@media (max-width: 640px) {
  .set-row {
    align-items: stretch;
    flex-direction: column;
  }

  .set-row__actions {
    width: 100%;
  }

  .set-row__actions button {
    flex: 1;
  }

  .set-row__form {
    grid-template-columns: 1fr;
  }
}
</style>
