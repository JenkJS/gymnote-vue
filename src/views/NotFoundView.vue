<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { useI18n } from 'vue-i18n'

import { ROUTE_NAMES } from '@/router'

const { t } = useI18n()
</script>

<template>
  <section class="not-found" aria-labelledby="not-found-title">
    <p class="not-found__code" aria-hidden="true">404</p>

    <h2 id="not-found-title" class="not-found__title">
      {{ t('notFound.title') }}
    </h2>

    <p class="not-found__description">
      {{ t('notFound.description') }}
    </p>

    <RouterLink class="not-found__link" :to="{ name: ROUTE_NAMES.workout }">
      {{ t('notFound.backToWorkout') }}
    </RouterLink>
  </section>
</template>

<style scoped>
.not-found {
  display: grid;
  justify-items: center;
  gap: 1rem;
  padding: clamp(2rem, 8vw, 5rem) 1.5rem;
  text-align: center;
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 1rem;
}

.not-found__code {
  margin: 0;
  color: var(--color-accent);
  font-size: clamp(3rem, 12vw, 6rem);
  font-weight: 800;
  line-height: 1;
}

.not-found__title {
  margin: 0;
  font-size: clamp(1.5rem, 5vw, 2rem);
}

.not-found__description {
  max-width: 32rem;
  margin: 0;
  color: var(--color-text-muted);
  line-height: 1.5;
}

.not-found__link {
  display: inline-flex;
  align-items: center;
  min-height: 2.75rem;
  padding-inline: 1rem;
  color: var(--color-background);
  font-weight: 700;
  text-decoration: none;
  background-color: var(--color-accent);
  border-radius: 0.625rem;
}

.not-found__link:focus-visible {
  outline: 3px solid var(--color-accent);
  outline-offset: 3px;
}

@media (hover: hover) {
  .not-found__link:hover {
    background-color: var(--color-accent-hover);
  }
}
</style>
