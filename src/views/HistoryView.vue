<script setup lang="ts">
import { useI18n } from 'vue-i18n'

import WorkoutHistory from '@/components/WorkoutHistory.vue'
import { storeToRefs } from 'pinia'
import { useWorkoutStore } from '@/stores/workout'

const { t } = useI18n()
const workoutStore = useWorkoutStore()
const { loadWorkouts } = workoutStore
const { completedWorkouts, isLoading, hasLoadError } = storeToRefs(workoutStore)
</script>

<template>
  <p v-if="isLoading" class="history-state" role="status">
    {{ t('common.loading') }}
  </p>

  <div v-else-if="hasLoadError" class="history-state history-state--error" role="alert">
    <p>{{ t('history.loadError') }}</p>

    <button type="button" @click="loadWorkouts">
      {{ t('common.retry') }}
    </button>
  </div>

  <section
    v-else-if="completedWorkouts.length === 0"
    class="history-state"
    aria-labelledby="empty-history-title"
  >
    <h2 id="empty-history-title">{{ t('history.title') }}</h2>
    <p>{{ t('history.empty') }}</p>
  </section>

  <WorkoutHistory v-else :workouts="completedWorkouts" />
</template>

<style scoped>
.history-state {
  padding: 1.5rem;
  color: var(--color-text-muted);
  text-align: center;
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 1rem;
}

.history-state h2,
.history-state p {
  margin: 0;
}

.history-state h2 + p {
  margin-top: 0.75rem;
}

.history-state--error {
  display: grid;
  justify-items: center;
  gap: 1rem;
  color: var(--color-danger);
}

.history-state--error button {
  min-height: 2.75rem;
  padding-inline: 1rem;
  color: var(--color-text);
  background: transparent;
  border: 1px solid var(--color-danger);
  border-radius: 0.625rem;
  cursor: pointer;
}
</style>
