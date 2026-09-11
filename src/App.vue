<script setup lang="ts">
import AppHeader from './components/AppHeader.vue'
import WorkoutSection from './components/WorkoutSection.vue'
</script>

<template>
  <div class="app">
    <AppHeader />
    <main class="app__content">
      <WorkoutSection />
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
