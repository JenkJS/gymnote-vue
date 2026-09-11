<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { setAppLocale } from '../i18n'
const { t, locale } = useI18n()
</script>

<template>
  <header class="app-header">
    <div class="app-header__inner">
      <div class="app-header__brand">
        <h1 class="app-header__title">GYMNOTE</h1>
        <p class="app-header__subtitle">{{ t('header.subtitle') }}</p>
      </div>

      <div class="language-switcher" role="group" :aria-label="t('header.language')">
        <button
          class="language-switcher__button"
          type="button"
          :aria-pressed="locale === 'ru'"
          @click="setAppLocale('ru')"
        >
          RU
        </button>

        <button
          class="language-switcher__button"
          type="button"
          :aria-pressed="locale === 'en'"
          @click="setAppLocale('en')"
        >
          EN
        </button>
      </div>
    </div>
  </header>
</template>

<style scoped>
.app-header {
  border-bottom: 1px solid var(--color-border);
  background-color: var(--color-surface);
}

.app-header__inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: min(calc(100% - 2rem), var(--content-max-width));
  margin-inline: auto;
  padding-block: 1rem;
  gap: 1rem;
}

.app-header__brand {
  display: grid;
  gap: 0.25rem;
  text-align: center;
}

.app-header__title {
  margin: 0;
  color: var(--color-accent);
  font-size: 1.5rem;
  line-height: 1;
  letter-spacing: 0.08em;
}

.app-header__subtitle {
  margin: 0;
  color: var(--color-text-muted);
  font-size: 0.875rem;
}

.language-switcher {
  display: inline-flex;
  gap: 0.25rem;
  padding: 0.25rem;
  background-color: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: 0.75rem;
}

.language-switcher__button {
  min-width: 2.75rem;
  min-height: 2.75rem;
  padding: 0.5rem;
  color: var(--color-text-muted);
  background-color: transparent;
  border: 0;
  border-radius: 0.5rem;
  cursor: pointer;
}

.language-switcher__button[aria-pressed='true'] {
  color: var(--color-background);
  background-color: var(--color-accent);
}

.language-switcher__button:focus-visible {
  outline: 3px solid var(--color-accent);
  outline-offset: 2px;
}

@media (hover: hover) {
  .language-switcher__button:hover:not([aria-pressed='true']) {
    color: var(--color-text);
    background-color: var(--color-border);
  }
}

@media (min-width: 40rem) {
  .app-header__inner {
    flex-direction: row;
    justify-content: space-between;
  }

  .app-header__brand {
    text-align: left;
  }
}
</style>
