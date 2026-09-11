<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'

import { useTrainingPrograms } from '@/composables/useTrainingPrograms'
import type { TrainingProgram, TrainingProgramDay } from '@/domain/program/types'

defineProps<{
  canStartWorkout: boolean
}>()

const emit = defineEmits<{
  startProgramDay: [program: TrainingProgram, day: TrainingProgramDay]
}>()

const { t } = useI18n()

const {
  programs,
  isLoading,
  hasLoadError,
  isImporting,
  importError,
  importedProgramCount,
  importPrograms,
  loadPrograms,
} = useTrainingPrograms()

const fileInput = ref<HTMLInputElement | null>(null)

const importErrorMessage = computed(() => {
  const error = importError.value

  if (!error) {
    return ''
  }

  switch (error.reason) {
    case 'fileReadFailed':
      return t('trainingProgram.errors.fileReadFailed')

    case 'invalidJson':
      return t('trainingProgram.errors.invalidJson')

    case 'invalidStructure':
      return t('trainingProgram.errors.invalidStructure')

    case 'unknownExercise':
      return t('trainingProgram.errors.unknownExercise', {
        exerciseId: error.exerciseId,
      })

    case 'saveFailed':
      return t('trainingProgram.errors.saveFailed')
    default:
      return ''
  }
})

function openFilePicker() {
  fileInput.value?.click()
}

async function handleFileSelection(event: Event) {
  const input = event.currentTarget

  if (!(input instanceof HTMLInputElement)) {
    return
  }

  const file = input.files?.[0]

  if (!file) {
    return
  }

  await importPrograms(file)

  input.value = ''
}

function requestProgramDayStart(program: TrainingProgram, day: TrainingProgramDay) {
  emit('startProgramDay', program, day)
}
</script>
<template>
  <section class="training-programs" aria-labelledby="training-programs-title">
    <header class="training-programs__header">
      <div>
        <h2 id="training-programs-title">
          {{ t('trainingProgram.title') }}
        </h2>

        <p>{{ t('trainingProgram.description') }}</p>
      </div>

      <div class="program-import">
        <input
          id="training-program-file"
          ref="fileInput"
          class="program-import__input"
          type="file"
          accept=".json,application/json"
          :aria-label="t('trainingProgram.import.label')"
          @change="handleFileSelection"
        />

        <button
          class="program-import__button"
          type="button"
          :disabled="isImporting"
          @click="openFilePicker"
        >
          {{
            isImporting ? t('trainingProgram.import.importing') : t('trainingProgram.import.action')
          }}
        </button>

        <p class="program-import__hint">
          {{ t('trainingProgram.import.hint') }}
        </p>
      </div>
    </header>

    <p
      v-if="importErrorMessage"
      class="training-programs__message training-programs__message--error"
      role="alert"
    >
      {{ importErrorMessage }}
    </p>

    <p
      v-if="importedProgramCount > 0"
      class="training-programs__message training-programs__message--success"
      role="status"
    >
      {{
        t('trainingProgram.import.success', {
          count: importedProgramCount,
        })
      }}
    </p>

    <p v-if="isLoading">
      {{ t('common.loading') }}
    </p>

    <div v-else-if="hasLoadError" class="training-programs__load-error" role="alert">
      <p>{{ t('trainingProgram.errors.load') }}</p>

      <button type="button" @click="loadPrograms">
        {{ t('common.retry') }}
      </button>
    </div>

    <p v-else-if="programs.length === 0">
      {{ t('trainingProgram.empty') }}
    </p>

    <ul v-else class="training-programs__list">
      <li v-for="program in programs" :key="program.id" class="training-programs__item">
        <h3>{{ program.name }}</h3>

        <p>
          {{
            t('trainingProgram.dayCount', {
              count: program.days.length,
            })
          }}
        </p>

        <h4 class="training-programs__days-title">
          {{ t('trainingProgram.chooseDay') }}
        </h4>

        <ul class="training-programs__days">
          <li
            v-for="day in [...program.days].sort((first, second) => first.order - second.order)"
            :key="day.id"
            class="training-programs__day"
          >
            <span>{{ day.name }}</span>

            <button
              type="button"
              :disabled="!canStartWorkout"
              @click="requestProgramDayStart(program, day)"
            >
              {{ t('trainingProgram.startDay') }}
            </button>
          </li>
        </ul>

        <p v-if="!canStartWorkout" class="training-programs__warning">
          {{ t('trainingProgram.activeWorkoutWarning') }}
        </p>
      </li>
    </ul>
  </section>
</template>
<style scoped>
.training-programs {
  display: grid;
  gap: 1.5rem;
  padding: clamp(1rem, 3vw, 2rem);
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 1rem;
}

.training-programs__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 2rem;
}

.training-programs__header h2,
.training-programs__header p {
  margin: 0;
}

.training-programs__header h2 {
  font-size: clamp(1.5rem, 4vw, 2rem);
}

.training-programs__header p {
  max-width: 42rem;
  margin-top: 0.5rem;
  color: var(--color-text-muted);
  line-height: 1.5;
}

.program-import {
  display: flex;
  flex: 0 0 auto;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 0.5rem;
}

/*
 * Input остаётся доступным для браузера и screen reader,
 * но визуально скрывается.
 */
.program-import__input {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
  border: 0;
}

.program-import__button,
.training-programs__load-error button {
  min-height: 44px;
  padding: 0.75rem 1rem;
  color: var(--color-background);
  font-weight: 700;
  background-color: var(--color-accent);
  border: 1px solid var(--color-accent);
  border-radius: 0.75rem;
  cursor: pointer;
}

.program-import__button:disabled {
  cursor: wait;
  opacity: 0.55;
}

.program-import__hint {
  flex-basis: 100%;
  font-size: 0.875rem;
  text-align: right;
}

.training-programs__message {
  margin: 0;
  padding: 0.875rem 1rem;
  border: 1px solid;
  border-radius: 0.75rem;
}

.training-programs__message--error {
  color: var(--color-danger);
  border-color: var(--color-danger);
}

.training-programs__message--success {
  color: var(--color-accent);
  border-color: var(--color-accent);
}

.training-programs__load-error {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.training-programs__load-error p {
  margin: 0;
  color: var(--color-danger);
}

.training-programs__list {
  display: grid;
  gap: 0.75rem;
  padding: 0;
  margin: 0;
  list-style: none;
}

.training-programs__item {
  padding: 1rem;
  background-color: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: 0.75rem;
}

.training-programs__item h3,
.training-programs__item p {
  margin: 0;
}

.training-programs__days-title {
  margin: 1rem 0 0.625rem;
  font-size: 0.875rem;
}

.training-programs__days {
  display: grid;
  gap: 0.5rem;
  padding: 0;
  margin: 0;
  list-style: none;
}

.training-programs__day {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.75rem;
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 0.625rem;
}

.training-programs__day button {
  min-height: 2.75rem;
  padding-inline: 0.875rem;
  color: var(--color-background);
  font-weight: 700;
  background-color: var(--color-accent);
  border: 0;
  border-radius: 0.625rem;
  cursor: pointer;
}

.training-programs__day button:disabled {
  cursor: not-allowed;
  opacity: 0.45;
}

.training-programs__warning {
  color: var(--color-danger) !important;
}

.training-programs__item p {
  margin-top: 0.35rem;
  color: var(--color-text-muted);
}

.program-import__button:focus-visible,
.training-programs__load-error button:focus-visible {
  outline: 3px solid var(--color-accent);
  outline-offset: 3px;
}

@media (hover: hover) {
  .program-import__button:not(:disabled):hover,
  .training-programs__load-error button:hover {
    filter: brightness(1.08);
  }
}

@media (max-width: 640px) {
  .training-programs__header {
    flex-direction: column;
    gap: 1.25rem;
  }

  .program-import {
    justify-content: stretch;
    width: 100%;
  }

  .program-import__button {
    width: 100%;
  }

  .program-import__hint {
    text-align: left;
  }

  .training-programs__load-error {
    align-items: stretch;
    flex-direction: column;
  }

  .training-programs__day {
    align-items: stretch;
    flex-direction: column;
  }
}
</style>
