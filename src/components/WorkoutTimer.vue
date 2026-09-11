<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'

const props = defineProps<{
  startedAt: string
}>()

const { t } = useI18n()

const currentTime = ref(Date.now())

let intervalId: number | undefined
const elapsedSeconds = computed(() => {
  const startedAt = new Date(props.startedAt).getTime()
  const difference = currentTime.value - startedAt

  return Math.max(0, Math.floor(difference / 1000))
})

const formattedTime = computed(() => {
  const hours = Math.floor(elapsedSeconds.value / 3600)
  const minutes = Math.floor((elapsedSeconds.value % 3600) / 60)
  const seconds = elapsedSeconds.value % 60

  return [hours, minutes, seconds].map((value) => String(value).padStart(2, '0')).join(':')
})

onMounted(() => {
  intervalId = window.setInterval(() => {
    currentTime.value = Date.now()
  }, 1000)
})

onUnmounted(() => {
  if (intervalId !== undefined) {
    window.clearInterval(intervalId)
  }
})
</script>

<template>
  <div class="workout-timer">
    <span class="workout-timer__label">
      {{ t('workout.elapsedTime') }}
    </span>

    <time class="workout-timer__value">
      {{ formattedTime }}
    </time>
  </div>
</template>

<style scoped>
.workout-timer {
  display: grid;
  gap: 0.125rem;
  text-align: right;
}

.workout-timer__label {
  color: var(--color-text-muted);
  font-size: 0.75rem;
}

.workout-timer__value {
  font-variant-numeric: tabular-nums;
  font-weight: 700;
  letter-spacing: 0.05em;
}

@media (max-width: 39.999rem) {
  .workout-timer {
    text-align: left;
  }
}
</style>
