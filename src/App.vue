<script setup lang="ts">
import { onMounted } from 'vue'
import { RouterView } from 'vue-router'

import AppHeader from './components/AppHeader.vue'
import { useWorkoutStore } from '@/stores/workout'

const workoutStore = useWorkoutStore()

onMounted(() => {
  void workoutStore.loadWorkouts()
})
</script>

<template>
  <div class="app">
    <AppHeader />
    <main class="app__content">
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
.app {
  min-height: 100vh;
}
.app__content {
  display: grid;
  gap: 2rem;
  width: min(calc(100% - 2rem), var(--content-max-width));
  margin-inline: auto;
  padding-block: 2rem;
}
</style>
