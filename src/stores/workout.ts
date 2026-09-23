import { defineStore } from 'pinia'
import { useWorkoutSession } from '@/composables/useWorkoutSession'
export const useWorkoutStore = defineStore('workout', () => {
  return useWorkoutSession()
})
