import { createApp } from 'vue'
import App from './App.vue'
import './assets/styles/main.css'
import { i18n } from './i18n'
import { router } from './router'
import { createPinia } from 'pinia'

const app = createApp(App)
const pinia = createPinia()

app.use(i18n)
app.use(pinia)
app.use(router)

app.mount('#app')
