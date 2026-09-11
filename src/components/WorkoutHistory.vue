<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

import {
  calculateDurationMinutes,
  calculateExerciseCount,
  calculateSetCount,
  calculateWorkoutVolume,
} from '@/domain/workout/analytics'
import type { WorkoutSession } from '@/domain/workout/types'
import { systemExercises } from '@/domain/exercise/systemExercises'

const props = defineProps<{
  workouts: WorkoutSession[]
}>()

const { t, locale } = useI18n()
function formatDate(date: string) {
  const language = locale.value === 'ru' ? 'ru-RU' : 'en-US'

  return new Intl.DateTimeFormat(language, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(date))
}

function getExerciseName(exerciseId: string) {
  const exercise = systemExercises.find((item) => item.id === exerciseId)

  return exercise ? t(exercise.nameKey) : exerciseId
}

const workoutSummaries = computed(() => {
  return [...props.workouts]
    .filter((workout) => workout.deletedAt === null)
    .sort((first, second) => second.startedAt.localeCompare(first.startedAt))
    .map((workout) => ({
      id: workout.id,
      startedAt: workout.startedAt,
      formattedDate: formatDate(workout.startedAt),
      duration: calculateDurationMinutes(workout),
      exerciseCount: calculateExerciseCount(workout),
      setCount: calculateSetCount(workout),
      volume: calculateWorkoutVolume(workout),
      sourceTitle:
        workout.source.type === 'program' ? workout.source.programName : t('history.freeWorkout'),
      dayName: workout.source.type === 'program' ? workout.source.dayName : null,
      exercises: [...workout.exercises]
        .filter((exercise) => exercise.deletedAt === null)
        .sort((first, second) => first.order - second.order)
        .map((exercise) => ({
          id: exercise.id,
          name: getExerciseName(exercise.exerciseId),
          sets: exercise.sets.filter((workoutSet) => workoutSet.deletedAt === null),
        })),
    }))
})
</script>
<template>
  <section class="workout-history" aria-labelledby="history-title">
    <h2 id="history-title" class="workout-history__title">
      {{ t('history.title') }}
    </h2>

    <ul class="workout-history__list">
      <li v-for="summary in workoutSummaries" :key="summary.id" class="history-card">
        <time class="history-card__date" :datetime="summary.startedAt">
          {{ summary.formattedDate }}
        </time>

        <div class="history-card__source">
          <h3>{{ summary.sourceTitle }}</h3>
          <p v-if="summary.dayName">{{ summary.dayName }}</p>
        </div>

        <dl class="history-card__metrics">
          <div>
            <dt>{{ t('history.duration') }}</dt>
            <dd>
              {{ summary.duration }}
              {{ t('history.minuteUnit') }}
            </dd>
          </div>

          <div>
            <dt>{{ t('history.exercises') }}</dt>
            <dd>{{ summary.exerciseCount }}</dd>
          </div>

          <div>
            <dt>{{ t('history.sets') }}</dt>
            <dd>{{ summary.setCount }}</dd>
          </div>

          <div>
            <dt>{{ t('history.volume') }}</dt>
            <dd>
              {{ summary.volume }}
              {{ t('history.volumeUnit') }}
            </dd>
          </div>
        </dl>

        <details class="history-card__details">
          <summary>{{ t('history.exerciseResults') }}</summary>

          <ul class="history-card__exercises">
            <li v-for="exercise in summary.exercises" :key="exercise.id">
              <h4>{{ exercise.name }}</h4>

              <p v-if="exercise.sets.length === 0" class="history-card__no-sets">
                {{ t('history.noSets') }}
              </p>

              <ol v-else class="history-card__sets">
                <li v-for="(workoutSet, index) in exercise.sets" :key="workoutSet.id">
                  <span>{{ index + 1 }}</span>
                  <template v-if="workoutSet.measurement === 'weight_repetitions'">
                    {{ workoutSet.weight }} {{ t('workoutSet.weightUnit') }} ×
                    {{ workoutSet.repetitions }} {{ t('workoutSet.repetitionsUnit') }}
                  </template>
                  <template v-else>
                    {{ workoutSet.durationSeconds }} {{ t('workoutSet.durationUnit') }}
                  </template>
                </li>
              </ol>
            </li>
          </ul>
        </details>
      </li>
    </ul>
  </section>
</template>

<style scoped>
.workout-history {
  display: grid;
  gap: 1rem;
  padding: 1.25rem;
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 1rem;
}

.workout-history__title {
  margin: 0;
  font-size: 1.5rem;
}

.workout-history__list {
  display: grid;
  gap: 0.75rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.history-card {
  display: grid;
  gap: 1rem;
  padding: 1rem;
  background-color: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: 0.75rem;
}

.history-card__date {
  color: var(--color-text-muted);
  font-size: 0.875rem;
  font-weight: 700;
}

.history-card__source h3,
.history-card__source p {
  margin: 0;
}

.history-card__source p {
  margin-top: 0.25rem;
  color: var(--color-accent);
  font-weight: 700;
}

.history-card__metrics {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
  margin: 0;
}

.history-card__metrics div {
  display: grid;
  gap: 0.25rem;
}

.history-card__metrics dt {
  color: var(--color-text-muted);
  font-size: 0.75rem;
}

.history-card__metrics dd {
  margin: 0;
  font-weight: 700;
}

.history-card__details {
  padding-top: 0.75rem;
  border-top: 1px solid var(--color-border);
}

.history-card__details summary {
  min-height: 2.75rem;
  color: var(--color-accent);
  font-weight: 700;
  line-height: 2.75rem;
  cursor: pointer;
}

.history-card__exercises {
  display: grid;
  gap: 0.75rem;
  padding: 0;
  margin: 0.75rem 0 0;
  list-style: none;
}

.history-card__exercises > li {
  display: grid;
  gap: 0.5rem;
  padding: 0.75rem;
  background-color: var(--color-surface);
  border-radius: 0.625rem;
}

.history-card__exercises h4,
.history-card__no-sets {
  margin: 0;
}

.history-card__no-sets {
  color: var(--color-text-muted);
  font-size: 0.875rem;
}

.history-card__sets {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  padding: 0;
  margin: 0;
  list-style: none;
}

.history-card__sets li {
  padding: 0.375rem 0.625rem;
  font-size: 0.875rem;
  font-weight: 700;
  background-color: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: 999px;
}

.history-card__sets li > span {
  margin-right: 0.25rem;
  color: var(--color-accent);
}

@media (min-width: 40rem) {
  .workout-history {
    padding: 2rem;
  }

  .history-card__metrics {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}
</style>
