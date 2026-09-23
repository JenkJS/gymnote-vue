<script setup lang="ts">
import { useRouter } from 'vue-router'
import TrainingProgramsSection from '@/components/TrainingProgramsSection.vue'
import { useWorkoutStore } from '@/stores/workout'
import { storeToRefs } from 'pinia'
import type { TrainingProgram, TrainingProgramDay } from '@/domain/program/types'
import { ROUTE_NAMES } from '@/router'

const router = useRouter()
const workoutStore = useWorkoutStore()

const { activeWorkout } = storeToRefs(workoutStore)
const { startWorkoutFromProgramDay } = workoutStore

async function startProgramDay(program: TrainingProgram, day: TrainingProgramDay) {
  const didStart = await startWorkoutFromProgramDay(program, day)
  if (!didStart) {
    return
  }
  await router.push({ name: ROUTE_NAMES.workout })
}
</script>

<template>
  <TrainingProgramsSection
    :can-start-workout="!activeWorkout"
    @start-program-day="startProgramDay"
  />
</template>
